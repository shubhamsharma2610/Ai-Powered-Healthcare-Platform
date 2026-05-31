import Patient from '../models/Patient.js';
import User from '../models/User.js';
import Appointment from '../models/Appointment.js';
import Payment from '../models/Payment.js';  // 👈 Add this

// Get patient profile
export const getPatientProfile = async (req, res) => {
  try {
    const patient = await Patient.findById(req.userId).populate('_id', 'fullName email');
    
    if (!patient) {
      return res.status(404).json({ success: false, message: 'Patient not found' });
    }
    
    res.json({ success: true, data: patient });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update patient profile
export const updatePatientProfile = async (req, res) => {
  try {
    const { age, gender, bloodType, phoneNumber, emergencyContact } = req.body;
    
    const patient = await Patient.findByIdAndUpdate(
      req.userId,
      { age, gender, bloodType, phoneNumber, emergencyContact },
      { new: true, runValidators: true }
    );
    
    if (phoneNumber) {
      await User.findByIdAndUpdate(req.userId, { phoneNumber });
    }
    
    res.json({ success: true, data: patient });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get patient appointments
export const getPatientAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ patientId: req.userId })
      .populate('doctorId', 'fullName specialization consultationFee')
      .sort({ createdAt: -1 });
    
    res.json({ success: true, data: appointments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ ADD THIS: Get transaction/payment history
export const getTransactionHistory = async (req, res) => {
  try {
    const payments = await Payment.find({ patientId: req.userId })
      .populate('appointmentId', 'date timeSlot status')
      .populate('doctorId', 'fullName specialization')
      .sort({ createdAt: -1 });
    
    // Calculate summary
    const totalSpent = payments
      .filter(p => p.status === 'success')
      .reduce((sum, p) => sum + p.amount, 0);
    
    const successfulPayments = payments.filter(p => p.status === 'success').length;
    const failedPayments = payments.filter(p => p.status === 'failed').length;
    
    res.json({ 
      success: true, 
      data: {
        transactions: payments,
        summary: {
          totalSpent,
          totalTransactions: payments.length,
          successfulPayments,
          failedPayments
        }
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};