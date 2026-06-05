import Doctor from '../models/Doctor.js';
import User from '../models/User.js';
import Appointment from '../models/Appointment.js';
import Patient from '../models/Patient.js';

/**
 * @desc    Get all pending doctors (submitted for approval but not approved yet)
 * @route   GET /api/admin/pending-doctors
 * @access  Private/Admin
 */
export const getPendingDoctors = async (req, res) => {
  try {
    // ✅ Only fetch doctors who have submitted for approval
    const doctors = await Doctor.aggregate([
      {
        $match: { 
          submittedForApproval: true,  // ✅ IMPORTANT: Only submitted for approval
          isApproved: false,           // Not approved yet
          isRejected: { $ne: true }    // Not rejected
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'userData'
        }
      },
      {
        $unwind: {
          path: '$userData',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $sort: { 'submittedAt': -1 }  // Show newest submissions first
      }
    ]);
    
    const formattedDoctors = doctors.map(doctor => ({
      _id: doctor._id,
      fullName: doctor.userData?.fullName || 'Unknown Doctor',
      name: doctor.userData?.fullName || 'Unknown Doctor',
      email: doctor.userData?.email || '',
      profilePicture: doctor.userData?.profilePicture || '',
      licenseNumber: doctor.licenseNumber,
      specialization: doctor.specialization,
      experience: doctor.experience,
      consultationFee: doctor.consultationFee,
      phoneNumber: doctor.phoneNumber,
      bio: doctor.bio,
      clinicAddress: doctor.clinicAddress,
      qualifications: doctor.qualifications,
      submittedForApproval: doctor.submittedForApproval,
      submittedAt: doctor.submittedAt,
      isApproved: doctor.isApproved,
      createdAt: doctor.userData?.createdAt || doctor.createdAt,
      appliedOn: doctor.submittedAt || doctor.createdAt
    }));
    
    res.json({ 
      success: true, 
      count: formattedDoctors.length,
      data: formattedDoctors 
    });
  } catch (error) {
    console.error('Get pending doctors error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Approve a doctor
 * @route   PUT /api/admin/approve-doctor/:id
 * @access  Private/Admin
 */
export const approveDoctor = async (req, res) => {
  try {
    const { id } = req.params;
    
    const doctor = await Doctor.findById(id).populate('_id', 'fullName email');
    
    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor not found' });
    }
    
    // Update doctor approval status
    doctor.isApproved = true;
    doctor.submittedForApproval = false;  // Reset submission flag
    doctor.approvedAt = new Date();
    doctor.isRejected = false;
    doctor.rejectionReason = null;
    doctor.status = 'active';
    
    await doctor.save();
    
    res.json({ 
      success: true, 
      message: 'Doctor approved successfully',
      data: {
        _id: doctor._id,
        fullName: doctor._id?.fullName,
        email: doctor._id?.email,
        isApproved: doctor.isApproved,
        approvedAt: doctor.approvedAt
      }
    });
  } catch (error) {
    console.error('Approve doctor error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Reject a doctor
 * @route   PUT /api/admin/reject-doctor/:id
 * @access  Private/Admin
 */
export const rejectDoctor = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    
    const doctor = await Doctor.findById(id).populate('_id', 'fullName email');
    
    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor not found' });
    }
    
    // Update doctor rejection status
    doctor.isApproved = false;
    doctor.submittedForApproval = false;  // Reset submission flag
    doctor.isRejected = true;
    doctor.rejectionReason = reason || 'Profile does not meet our requirements';
    doctor.rejectedAt = new Date();
    doctor.status = 'rejected';
    
    await doctor.save();
    
    res.json({ 
      success: true, 
      message: 'Doctor application rejected',
      data: {
        _id: doctor._id,
        fullName: doctor._id?.fullName,
        email: doctor._id?.email,
        isRejected: doctor.isRejected,
        rejectionReason: doctor.rejectionReason
      }
    });
  } catch (error) {
    console.error('Reject doctor error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Get all doctors (admin view)
 * @route   GET /api/admin/doctors
 * @access  Private/Admin
 */
export const getAllDoctorsAdmin = async (req, res) => {
  try {
    const doctors = await Doctor.aggregate([
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'userData'
        }
      },
      {
        $unwind: {
          path: '$userData',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $sort: { 'userData.createdAt': -1 }
      }
    ]);
    
    const formattedDoctors = doctors.map(doctor => ({
      _id: doctor._id,
      fullName: doctor.userData?.fullName || 'Unknown',
      email: doctor.userData?.email || '',
      profilePicture: doctor.userData?.profilePicture || '',
      specialization: doctor.specialization,
      experience: doctor.experience,
      consultationFee: doctor.consultationFee,
      phoneNumber: doctor.phoneNumber,
      isApproved: doctor.isApproved,
      submittedForApproval: doctor.submittedForApproval,
      isRejected: doctor.isRejected,
      approvedAt: doctor.approvedAt,
      submittedAt: doctor.submittedAt,
      createdAt: doctor.userData?.createdAt
    }));
    
    res.json({ success: true, data: formattedDoctors });
  } catch (error) {
    console.error('Get all doctors admin error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Get all patients (admin view)
 * @route   GET /api/admin/patients
 * @access  Private/Admin
 */
export const getAllPatientsAdmin = async (req, res) => {
  try {
    const patients = await Patient.aggregate([
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'userData'
        }
      },
      {
        $unwind: {
          path: '$userData',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $sort: { 'userData.createdAt': -1 }
      }
    ]);
    
    const formattedPatients = patients.map(patient => ({
      _id: patient._id,
      fullName: patient.userData?.fullName || 'Unknown',
      email: patient.userData?.email || '',
      profilePicture: patient.userData?.profilePicture || '',
      age: patient.age,
      gender: patient.gender,
      bloodType: patient.bloodType,
      phoneNumber: patient.phoneNumber,
      appointmentCount: patient.appointmentCount || 0,
      createdAt: patient.userData?.createdAt || patient.createdAt
    }));
    
    res.json({ success: true, data: formattedPatients });
  } catch (error) {
    console.error('Get all patients admin error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Get platform stats (dashboard)
 * @route   GET /api/admin/stats
 * @access  Private/Admin
 */
export const getAdminStats = async (req, res) => {
  try {
    const [
      totalDoctors, 
      pendingDoctors, 
      approvedDoctors, 
      rejectedDoctors,
      submittedDoctors,
      totalPatients, 
      totalAppointments, 
      completedAppointments,
      pendingAppointments,
      cancelledAppointments
    ] = await Promise.all([
      Doctor.countDocuments(),
      Doctor.countDocuments({ isApproved: false, submittedForApproval: false }),
      Doctor.countDocuments({ isApproved: true }),
      Doctor.countDocuments({ isRejected: true }),
      Doctor.countDocuments({ submittedForApproval: true, isApproved: false }), // Doctors waiting for approval
      Patient.countDocuments(),
      Appointment.countDocuments(),
      Appointment.countDocuments({ status: 'completed' }),
      Appointment.countDocuments({ status: 'pending' }),
      Appointment.countDocuments({ status: 'cancelled' })
    ]);
    
    res.json({
      success: true,
      data: {
        totalDoctors,
        pendingDoctors,
        approvedDoctors,
        rejectedDoctors,
        submittedDoctors,  // ✅ New: Doctors pending admin review
        totalPatients,
        totalAppointments,
        completedAppointments,
        pendingAppointments,
        cancelledAppointments
      }
    });
  } catch (error) {
    console.error('Get admin stats error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Get single doctor details for admin review
 * @route   GET /api/admin/doctor/:id
 * @access  Private/Admin
 */
export const getDoctorDetails = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id).populate('_id', 'fullName email profilePicture');
    
    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor not found' });
    }
    
    res.json({
      success: true,
      data: {
        _id: doctor._id,
        fullName: doctor._id?.fullName,
        email: doctor._id?.email,
        profilePicture: doctor._id?.profilePicture,
        licenseNumber: doctor.licenseNumber,
        specialization: doctor.specialization,
        experience: doctor.experience,
        consultationFee: doctor.consultationFee,
        phoneNumber: doctor.phoneNumber,
        bio: doctor.bio,
        clinicAddress: doctor.clinicAddress,
        qualifications: doctor.qualifications,
        isApproved: doctor.isApproved,
        submittedForApproval: doctor.submittedForApproval,
        isRejected: doctor.isRejected,
        rejectionReason: doctor.rejectionReason,
        submittedAt: doctor.submittedAt,
        approvedAt: doctor.approvedAt,
        createdAt: doctor.createdAt
      }
    });
  } catch (error) {
    console.error('Get doctor details error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};