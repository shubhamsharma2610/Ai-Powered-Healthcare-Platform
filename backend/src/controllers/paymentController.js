import Razorpay from 'razorpay';
import crypto from 'crypto';
import Payment from '../models/Payment.js';
import Appointment from '../models/Appointment.js';
import Patient from '../models/Patient.js';
import Doctor from '../models/Doctor.js';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

// Create Razorpay order
export const createPaymentOrder = async (req, res) => {
  try {
    const { amount, appointmentId } = req.body;
    const patientId = req.user.id;

    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    const options = {
      amount: amount * 100,
      currency: 'INR',
      receipt: `receipt_${appointmentId}`
    };

    const order = await razorpay.orders.create(options);

    await Payment.create({
      appointmentId,
      patientId,
      doctorId: appointment.doctorId,
      amount,
      razorpayOrderId: order.id,
      status: 'created'
    });

    res.json({
      success: true,
      data: {
        orderId: order.id,
        amount: order.amount,
        currency: order.currency
      }
    });
  } catch (error) {
    console.error('Create payment order error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ UPDATED: Verify payment with proper status updates
export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, appointmentId } = req.body;

    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ success: false, message: 'Invalid signature' });
    }

    // ✅ Update payment as success
    await Payment.findOneAndUpdate(
      { razorpayOrderId: razorpay_order_id },
      {
        razorpayPaymentId: razorpay_payment_id,
        razorpaySignature: razorpay_signature,
        status: 'success'
      }
    );

    // ✅ CRITICAL: Update appointment to confirmed ONLY after payment success
    const updatedAppointment = await Appointment.findByIdAndUpdate(
      appointmentId,
      { 
        paymentStatus: 'paid',
        status: 'confirmed'  // ✅ PENDING → CONFIRMED
      },
      { new: true }
    );

    // ✅ Update patient's appointment count
    if (updatedAppointment) {
      await Patient.findByIdAndUpdate(updatedAppointment.patientId, {
        $inc: { appointmentCount: 1 },
        $push: { appointments: appointmentId }
      });
    }

    res.json({ 
      success: true, 
      message: 'Payment verified successfully',
      data: { appointment: updatedAppointment }
    });
  } catch (error) {
    console.error('Payment verification error:', error);
    
    // ✅ If verification fails, mark payment as failed
    if (req.body.razorpay_order_id) {
      await Payment.findOneAndUpdate(
        { razorpayOrderId: req.body.razorpay_order_id },
        { status: 'failed' }
      );
    }
    
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ NEW: Handle payment failure
export const paymentFailed = async (req, res) => {
  try {
    const { razorpay_order_id, appointmentId } = req.body;
    
    // Mark payment as failed
    await Payment.findOneAndUpdate(
      { razorpayOrderId: razorpay_order_id },
      { status: 'failed' }
    );
    
    // Optionally: Mark appointment as cancelled or keep pending for retry
    // We'll keep it pending so user can retry
    
    res.json({ 
      success: true, 
      message: 'Payment failed recorded' 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};