import Payment from '../models/Payment.js';
import Appointment from '../models/Appointment.js';
import { getRefundStatus } from '../utils/refundUtils.js';

/**
 * @desc    Get refund status for an appointment
 * @route   GET /api/refunds/status/:appointmentId
 * @access  Private
 */
export const getRefundStatusByAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    
    // Find appointment
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }
    
    // Check authorization (only patient, doctor, or admin)
    const userId = req.user.id;
    const userRole = req.user.role;
    
    if (userRole !== 'admin' && 
        appointment.patientId.toString() !== userId && 
        appointment.doctorId.toString() !== userId) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }
    
    // Get refund details
    const refundData = {
      isRefunded: appointment.paymentStatus === 'refunded',
      refundAmount: appointment.refundAmount || 0,
      refundPercentage: appointment.refundPercentage || 0,
      refundId: appointment.refundId || null,
      refundProcessedAt: appointment.refundProcessedAt || null,
      cancelledBy: appointment.cancelledBy,
      cancelledAt: appointment.cancelledAt,
      cancellationReason: appointment.cancellationReason
    };
    
    // If refund ID exists, get live status from Razorpay
    if (refundData.refundId) {
      const liveStatus = await getRefundStatus(refundData.refundId);
      if (liveStatus) {
        refundData.razorpayStatus = liveStatus.status;
        refundData.razorpayProcessedAt = liveStatus.createdAt;
      }
    }
    
    res.json({ success: true, data: refundData });
    
  } catch (error) {
    console.error('Get refund status error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Get all refunds for a user (patient)
 * @route   GET /api/refunds/my-refunds
 * @access  Private (Patient only)
 */
export const getMyRefunds = async (req, res) => {
  try {
    const patientId = req.user.id;
    
    const appointments = await Appointment.find({
      patientId,
      paymentStatus: 'refunded',
      refundAmount: { $gt: 0 }
    })
    .populate('doctorId', 'fullName specialization')
    .sort({ refundProcessedAt: -1 });
    
    const refunds = appointments.map(apt => ({
      id: apt._id,
      doctorName: apt.doctorId?.fullName,
      doctorSpecialty: apt.doctorId?.specialization,
      date: apt.date,
      timeSlot: apt.timeSlot,
      originalAmount: apt.amount,
      refundAmount: apt.refundAmount,
      refundPercentage: apt.refundPercentage,
      refundId: apt.refundId,
      refundProcessedAt: apt.refundProcessedAt,
      cancelledBy: apt.cancelledBy,
      cancellationReason: apt.cancellationReason
    }));
    
    res.json({ success: true, data: refunds });
    
  } catch (error) {
    console.error('Get my refunds error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};