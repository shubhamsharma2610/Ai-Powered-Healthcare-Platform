import Appointment from '../models/Appointment.js';
import Doctor from '../models/Doctor.js';
import Patient from '../models/Patient.js';

// Book appointment
export const bookAppointment = async (req, res) => {
  try {
    const { doctorId, date, timeSlot, symptoms, amount } = req.body;
    const patientId = req.user.id;

    const doctor = await Doctor.findById(doctorId);
    if (!doctor || !doctor.isApproved) {
      return res.status(404).json({ success: false, message: 'Doctor not found' });
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
        .populate('doctorId', 'fullName specialization consultationFee');
    } else if (userRole === 'doctor') {
      appointments = await Appointment.find({ doctorId: userId })
        .populate('patientId', 'fullName age gender');
    } else {
      appointments = await Appointment.find()
        .populate('patientId', 'fullName')
        .populate('doctorId', 'fullName');
    }

    res.json({ success: true, count: appointments.length, data: appointments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Cancel appointment
export const cancelAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    
    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    appointment.status = 'cancelled';
    await appointment.save();

    res.json({ success: true, message: 'Appointment cancelled successfully' });
  } catch (error) {
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

    appointment.status = status;
    if (status === 'completed') {
      await Doctor.findByIdAndUpdate(appointment.doctorId, {
        $inc: { totalConsultations: 1 }
      });
    }
    
    await appointment.save();
    res.json({ success: true, data: appointment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};