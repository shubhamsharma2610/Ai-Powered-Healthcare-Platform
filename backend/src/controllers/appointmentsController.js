import Appointment from '../models/Appointment.js';
import Doctor from '../models/Doctor.js';
import Patient from '../models/Patient.js';
import { processRefund, calculateRefundAmount, checkRefundEligibility, getRefundStatus } from '../utils/refundUtils.js';

// Book appointment - with duplicate check AND schedule validation
export const bookAppointment = async (req, res) => {
  try {
    const { doctorId, date, timeSlot, symptoms, amount } = req.body;
    const patientId = req.userId;

    const doctor = await Doctor.findById(doctorId);
    if (!doctor || !doctor.isApproved) {
      return res.status(404).json({ success: false, message: 'Doctor not found' });
    }

    // ✅ 1. Validate doctor's schedule for selected date
    const appointmentDate = new Date(date);
    const dayName = appointmentDate.toLocaleDateString('en-US', { weekday: 'long' });
    
    const daySchedule = doctor.availability?.find(slot => slot.day === dayName);
    
    if (!daySchedule || !daySchedule.isAvailable) {
      return res.status(400).json({ 
        success: false, 
        message: `Doctor is not available on ${dayName}. Please check doctor's schedule.` 
      });
    }
    
    // ✅ 2. Validate time slot is within working hours
    if (timeSlot < daySchedule.startTime || timeSlot > daySchedule.endTime) {
      return res.status(400).json({ 
        success: false, 
        message: `Selected time ${timeSlot} is outside doctor's working hours (${daySchedule.startTime} - ${daySchedule.endTime}).` 
      });
    }

    // ✅ 3. Duplicate booking check
    const existingAppointment = await Appointment.findOne({
      patientId,
      doctorId,
      date: new Date(date),
      timeSlot,
      status: { $in: ['pending', 'confirmed'] }
    });

    if (existingAppointment) {
      return res.status(400).json({ 
        success: false, 
        message: 'You already have an appointment at this time. Please cancel existing appointment to book a new one.' 
      });
    }

    // ✅ 4. Check if time slot is already booked by another patient
    const slotBooked = await Appointment.findOne({
      doctorId,
      date: new Date(date),
      timeSlot,
      status: { $in: ['pending', 'confirmed', 'completed'] }
    });

    if (slotBooked) {
      return res.status(400).json({ 
        success: false, 
        message: 'This time slot is already booked. Please select another time.' 
      });
    }

    const appointment = await Appointment.create({
      patientId,
      doctorId,
      date,
      timeSlot,
      symptoms,
      amount,
      status: 'pending',
      paymentStatus: 'pending'
    });

    await Patient.findByIdAndUpdate(patientId, {
      $push: { appointments: appointment._id },
      $inc: { appointmentCount: 1 }
    });

    res.status(201).json({ success: true, data: appointment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get my appointments
export const getMyAppointments = async (req, res) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;

    let appointments;
    if (userRole === 'patient') {
      appointments = await Appointment.find({ patientId: userId })
        .populate('doctorId', 'fullName specialization consultationFee')
        .sort({ date: -1 });
    } else if (userRole === 'doctor') {
      appointments = await Appointment.find({ doctorId: userId })
        .populate('patientId', 'fullName age gender')
        .sort({ date: -1 });
    } else {
      appointments = await Appointment.find()
        .populate('patientId', 'fullName')
        .populate('doctorId', 'fullName')
        .sort({ createdAt: -1 });
    }

    res.json({ success: true, count: appointments.length, data: appointments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get appointment by ID
export const getAppointmentById = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate('patientId', 'fullName email phoneNumber')
      .populate('doctorId', 'fullName specialization consultationFee');
    
    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }
    
    res.json({ success: true, data: appointment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Cancel appointment with refund logic
export const cancelAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    
    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    // Check if already cancelled or completed
    if (appointment.status === 'cancelled') {
      return res.status(400).json({ success: false, message: 'Appointment already cancelled.' });
    }
    
    if (appointment.status === 'completed') {
      return res.status(400).json({ success: false, message: 'Cannot cancel completed appointment.' });
    }

    const cancelledBy = req.user.role === 'admin' ? 'admin' : 
                        req.user.role === 'doctor' ? 'doctor' : 'patient';
    
    // Authorization check
    if (cancelledBy === 'patient' && appointment.patientId.toString() !== req.userId) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }
    
    if (cancelledBy === 'doctor' && appointment.doctorId.toString() !== req.userId) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    const now = new Date();
    const appointmentTime = new Date(appointment.date);
    const hoursDiff = (appointmentTime - now) / (1000 * 60 * 60);
    
    let refundAmount = 0;
    let refundPercentage = 0;
    let refundId = null;
    
    // Doctor or Admin cancel = ALWAYS 100% refund
    if (cancelledBy === 'doctor' || cancelledBy === 'admin') {
      if (appointment.paymentStatus === 'paid' && appointment.paymentId) {
        refundAmount = appointment.amount;
        refundPercentage = 100;
        
        try {
          const refund = await processRefund(appointment.paymentId, refundAmount);
          refundId = refund?.id || null;
        } catch (refundError) {
          console.error('Refund processing error:', refundError);
        }
      }
    } 
    // Patient cancel - based on time
    else if (cancelledBy === 'patient') {
      if (appointment.paymentStatus === 'paid') {
        if (hoursDiff > 24) {
          refundAmount = appointment.amount;
          refundPercentage = 100;
        } else if (hoursDiff > 12) {
          refundAmount = appointment.amount * 0.5;
          refundPercentage = 50;
        }
        
        if (refundAmount > 0 && appointment.paymentId) {
          try {
            const refund = await processRefund(appointment.paymentId, refundAmount);
            refundId = refund?.id || null;
          } catch (refundError) {
            console.error('Refund processing error:', refundError);
          }
        }
      }
    }

    // Update appointment
    appointment.status = 'cancelled';
    appointment.cancelledBy = cancelledBy;
    appointment.cancelledAt = now;
    appointment.cancellationReason = req.body.reason || '';
    appointment.refundAmount = refundAmount;
    appointment.refundPercentage = refundPercentage;
    appointment.refundId = refundId;
    
    if (refundAmount > 0) {
      appointment.paymentStatus = 'refunded';
      appointment.refundProcessedAt = new Date();
    }
    
    await appointment.save();

    const message = refundAmount > 0 
      ? `Appointment cancelled. ₹${refundAmount} (${refundPercentage}%) will be refunded.` 
      : 'Appointment cancelled successfully. No refund applicable.';

    res.json({ 
      success: true, 
      message,
      data: {
        refundAmount,
        refundPercentage,
        refundId,
        cancelledBy
      }
    });
  } catch (error) {
    console.error('Cancel appointment error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update appointment status (Doctor only)
export const updateAppointmentStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const appointment = await Appointment.findById(req.params.id);
    
    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    // Only doctor can update status
    if (appointment.doctorId.toString() !== req.userId && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    appointment.status = status;
    
    if (status === 'completed') {
      await Doctor.findByIdAndUpdate(appointment.doctorId, {
        $inc: { totalConsultations: 1 }
      });
      appointment.completedAt = new Date();
    }
    
    if (status === 'no-show') {
      appointment.noShowAt = new Date();
    }
    
    await appointment.save();
    
    res.json({ success: true, data: appointment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Check refund eligibility before cancellation
export const checkRefundEligibilityAPI = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    
    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }
    
    const cancelledBy = req.user.role === 'admin' ? 'admin' : 
                        req.user.role === 'doctor' ? 'doctor' : 'patient';
    
    const now = new Date();
    const appointmentTime = new Date(appointment.date);
    const hoursDiff = (appointmentTime - now) / (1000 * 60 * 60);
    
    let eligible = false;
    let amount = 0;
    let message = '';
    
    if (cancelledBy === 'doctor' || cancelledBy === 'admin') {
      eligible = true;
      amount = appointment.amount;
      message = 'Doctor/Admin cancellation: Full refund eligible.';
    } 
    else if (cancelledBy === 'patient') {
      if (appointment.paymentStatus !== 'paid') {
        message = 'No payment made. No refund.';
      } else if (hoursDiff > 24) {
        eligible = true;
        amount = appointment.amount;
        message = '100% refund eligible (24+ hours before appointment).';
      } else if (hoursDiff > 12) {
        eligible = true;
        amount = appointment.amount * 0.5;
        message = '50% refund eligible (12-24 hours before appointment).';
      } else {
        message = 'No refund eligible (<12 hours before appointment).';
      }
    }
    
    res.json({ success: true, data: { eligible, amount, message } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get doctor's completed appointments (for earnings)
export const getCompletedAppointments = async (req, res) => {
  try {
    const doctorId = req.userId;
    const appointments = await Appointment.find({ 
      doctorId, 
      status: 'completed' 
    }).sort({ completedAt: -1 });
    
    const totalEarnings = appointments.reduce((sum, apt) => sum + apt.amount, 0);
    
    res.json({ 
      success: true, 
      data: { appointments, totalEarnings }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ NEW: Check if time slot is available before booking
export const checkSlotAvailability = async (req, res) => {
  try {
    const { doctorId, date, timeSlot } = req.query;
    
    const doctor = await Doctor.findById(doctorId);
    if (!doctor || !doctor.isApproved) {
      return res.status(404).json({ success: false, message: 'Doctor not found' });
    }
    
    // Check schedule
    const appointmentDate = new Date(date);
    const dayName = appointmentDate.toLocaleDateString('en-US', { weekday: 'long' });
    const daySchedule = doctor.availability?.find(slot => slot.day === dayName);
    
    if (!daySchedule || !daySchedule.isAvailable) {
      return res.json({ success: true, available: false, reason: 'Doctor not available on this day' });
    }
    
    if (timeSlot && (timeSlot < daySchedule.startTime || timeSlot > daySchedule.endTime)) {
      return res.json({ success: true, available: false, reason: 'Time slot outside working hours' });
    }
    
    // Check if slot is already booked
    if (timeSlot) {
      const existingBooking = await Appointment.findOne({
        doctorId,
        date: new Date(date),
        timeSlot,
        status: { $in: ['pending', 'confirmed', 'completed'] }
      });
      
      if (existingBooking) {
        return res.json({ success: true, available: false, reason: 'Time slot already booked' });
      }
    }
    
    res.json({ success: true, available: true });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};