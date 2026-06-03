import Razorpay from 'razorpay';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

/**
 * Calculate refund amount based on cancellation time and who cancelled
 * @param {Object} appointment - Appointment object
 * @param {string} cancelledBy - 'patient', 'doctor', or 'admin'
 * @param {number} hoursDiff - Hours difference between now and appointment time
 * @returns {Object} { amount, percentage }
 */
export const calculateRefundAmount = (appointment, cancelledBy, hoursDiff) => {
  // Doctor or Admin cancel = ALWAYS 100% refund
  if (cancelledBy === 'doctor' || cancelledBy === 'admin') {
    return { 
      amount: appointment.amount, 
      percentage: 100,
      message: 'Doctor cancelled appointment. Full refund initiated.'
    };
  }
  
  // Patient cancelled - check payment status first
  if (appointment.paymentStatus !== 'paid') {
    return { 
      amount: 0, 
      percentage: 0,
      message: 'No payment made. No refund applicable.'
    };
  }
  
  // Patient cancel based on time
  if (hoursDiff > 24) {
    return { 
      amount: appointment.amount, 
      percentage: 100,
      message: 'Cancelled 24+ hours before appointment. Full refund initiated.'
    };
  }
  
  if (hoursDiff > 12) {
    return { 
      amount: appointment.amount * 0.5, 
      percentage: 50,
      message: 'Cancelled 12-24 hours before appointment. 50% refund initiated.'
    };
  }
  
  return { 
    amount: 0, 
    percentage: 0,
    message: 'Cancelled less than 12 hours before appointment. No refund applicable.'
  };
};

/**
 * Process refund via Razorpay
 * @param {string} paymentId - Razorpay payment ID
 * @param {number} amount - Amount to refund (in rupees)
 * @returns {Promise<Object>} Refund object
 */
export const processRefund = async (paymentId, amount) => {
  try {
    if (!paymentId) {
      throw new Error('No payment ID found');
    }
    
    if (amount <= 0) {
      return { id: null, status: 'skipped', message: 'No refund amount' };
    }
    
    const refund = await razorpay.payments.refund(paymentId, {
      amount: amount * 100, // Convert to paise
      speed: 'normal',
      notes: {
        reason: 'Appointment cancellation',
        timestamp: new Date().toISOString()
      }
    });
    
    console.log(`✅ Refund processed: ${refund.id} for ₹${amount}`);
    return refund;
    
  } catch (error) {
    console.error('❌ Refund processing failed:', error);
    throw new Error(`Refund failed: ${error.message}`);
  }
};

/**
 * Get refund status from Razorpay
 * @param {string} refundId - Razorpay refund ID
 * @returns {Promise<Object>} Refund status
 */
export const getRefundStatus = async (refundId) => {
  try {
    const refund = await razorpay.refunds.fetch(refundId);
    return {
      id: refund.id,
      status: refund.status,
      amount: refund.amount / 100,
      createdAt: new Date(refund.created_at * 1000),
      notes: refund.notes
    };
  } catch (error) {
    console.error('Failed to fetch refund status:', error);
    return null;
  }
};

/**
 * Check if refund is eligible
 * @param {Object} appointment - Appointment object
 * @param {string} cancelledBy - Who is cancelling
 * @returns {Object} { eligible, amount, message }
 */
export const checkRefundEligibility = (appointment, cancelledBy) => {
  const now = new Date();
  const appointmentTime = new Date(appointment.date);
  const hoursDiff = (appointmentTime - now) / (1000 * 60 * 60);
  
  // Already cancelled or completed
  if (appointment.status === 'cancelled') {
    return { eligible: false, amount: 0, message: 'Appointment already cancelled.' };
  }
  
  if (appointment.status === 'completed') {
    return { eligible: false, amount: 0, message: 'Appointment already completed.' };
  }
  
  // Doctor/Admin always eligible
  if (cancelledBy === 'doctor' || cancelledBy === 'admin') {
    return { eligible: true, amount: appointment.amount, message: 'Full refund eligible.' };
  }
  
  // Patient eligibility based on time
  if (appointment.paymentStatus !== 'paid') {
    return { eligible: false, amount: 0, message: 'No payment made.' };
  }
  
  if (hoursDiff > 24) {
    return { eligible: true, amount: appointment.amount, message: 'Full refund eligible (24+ hours).' };
  }
  
  if (hoursDiff > 12) {
    return { eligible: true, amount: appointment.amount * 0.5, message: '50% refund eligible.' };
  }
  
  return { eligible: false, amount: 0, message: 'No refund eligible (<12 hours).' };
};

export default {
  calculateRefundAmount,
  processRefund,
  getRefundStatus,
  checkRefundEligibility
};