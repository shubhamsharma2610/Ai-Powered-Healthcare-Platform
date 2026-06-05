import Doctor from '../models/Doctor.js';
import User from '../models/User.js';
import Appointment from '../models/Appointment.js';
import Payment from '../models/Payment.js';

/**
 * @desc    Get all approved doctors with filtering and pagination
 * @route   GET /api/doctors
 * @access  Public
 */
export const getAllDoctors = async (req, res) => {
  try {
    const {
      specialization,
      minExperience,
      maxFee,
      minRating,
      search,
      page = 1,
      limit = 10,
      sortBy = 'experience',
      sortOrder = 'desc'
    } = req.query;

    // Build filter object
    const filter = { isApproved: true };

    // Filter by specialization
    if (specialization) {
      filter.specialization = specialization;
    }

    // Filter by minimum experience
    if (minExperience) {
      filter.experience = { $gte: parseInt(minExperience) };
    }

    // Filter by consultation fee range
    if (maxFee) {
      filter.consultationFee = { $lte: parseInt(maxFee) };
    }

    // Filter by minimum rating
    if (minRating) {
      filter.rating = { $gte: parseFloat(minRating) };
    }

    // Search by name, specialization, or city
    if (search) {
      const users = await User.find({
        fullName: { $regex: search, $options: 'i' },
        role: 'doctor'
      }).select('_id');

      const userIds = users.map(u => u._id);
      
      filter.$or = [
        { _id: { $in: userIds } },
        { specialization: { $regex: search, $options: 'i' } },
        { 'clinicAddress.city': { $regex: search, $options: 'i' } }
      ];
    }

    // Pagination
    const skip = (page - 1) * limit;
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Execute queries in parallel
    const [doctors, totalCount] = await Promise.all([
      Doctor.find(filter)
        .sort(sortOptions)
        .skip(skip)
        .limit(parseInt(limit)),
      Doctor.countDocuments(filter)
    ]);

    // Get User data for all doctors
    const doctorIds = doctors.map(d => d._id);
    const users = await User.find({ _id: { $in: doctorIds } }).select('fullName email profilePicture');
    const userMap = new Map(users.map(u => [u._id.toString(), u]));

    // Format response
    const formattedDoctors = doctors.map(doctor => {
      const user = userMap.get(doctor._id.toString());
      return {
        id: String(doctor._id),
        fullName: user?.fullName || 'Unknown',
        email: user?.email || '',
        profilePicture: doctor.profilePicture || user?.profilePicture || '',
        specialization: doctor.specialization,
        experience: doctor.experience,
        consultationFee: doctor.consultationFee,
        rating: doctor.rating,
        totalConsultations: doctor.totalConsultations,
        clinicAddress: doctor.clinicAddress,
        qualifications: doctor.qualifications,
        bio: doctor.bio,
        phoneNumber: doctor.phoneNumber,
        availability: doctor.availability,
        isApproved: doctor.isApproved
      };
    });

    res.status(200).json({
      success: true,
      data: {
        doctors: formattedDoctors,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalCount / limit),
          totalItems: totalCount,
          itemsPerPage: parseInt(limit),
          hasNextPage: skip + formattedDoctors.length < totalCount,
          hasPrevPage: page > 1
        }
      }
    });

  } catch (error) {
    console.error('Get all doctors error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch doctors',
      error: error.message
    });
  }
};

/**
 * @desc    Get single doctor by ID
 * @route   GET /api/doctors/:id
 * @access  Public
 */
/**
 * @desc    Get single doctor by ID
 * @route   GET /api/doctors/:id
 * @access  Public
 */
export const getDoctorById = async (req, res) => {
  try {
    const { id } = req.params;
    
    // ✅ ADD THIS VALIDATION - Check if ID is valid MongoDB ObjectId
    const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(id);
    
    if (!isValidObjectId) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found'
      });
    }
    
    const doctor = await Doctor.findById(id);
    
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found'
      });
    }
    
    // Check if doctor is approved
    if (!doctor.isApproved) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found'
      });
    }
    
    const user = await User.findById(doctor._id).select('fullName email profilePicture createdAt');
    
    const formattedDoctor = {
      id: String(doctor._id),
      fullName: user?.fullName || 'Doctor Name',
      email: user?.email || '',
      profilePicture: doctor.profilePicture || user?.profilePicture || '',
      createdAt: doctor.createdAt || user?.createdAt,
      licenseNumber: doctor.licenseNumber,
      specialization: doctor.specialization,
      experience: doctor.experience,
      qualifications: doctor.qualifications,
      clinicAddress: doctor.clinicAddress,
      consultationFee: doctor.consultationFee,
      availability: doctor.availability,
      bio: doctor.bio,
      phoneNumber: doctor.phoneNumber,
      rating: doctor.rating,
      totalConsultations: doctor.totalConsultations,
      patientsCount: doctor.patients?.length || 0,
      isApproved: doctor.isApproved,
      approvedAt: doctor.approvedAt
    };
    
    res.status(200).json({
      success: true,
      data: formattedDoctor
    });
    
  } catch (error) {
    console.error('Get doctor by ID error:', error);
    
    if (error.name === 'CastError') {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to fetch doctor details',
      error: error.message
    });
  }
};
/**
 * @desc    Get doctor by specialization
 * @route   GET /api/doctors/specializations/:specialization
 * @access  Public
 */
export const getDoctorsBySpecialization = async (req, res) => {
  try {
    const { specialization } = req.params;
    
    const doctors = await Doctor.find({
      specialization: { $regex: new RegExp(`^${specialization}$`, 'i') },
      isApproved: true
    });

    const doctorIds = doctors.map(d => d._id);
    const users = await User.find({ _id: { $in: doctorIds } }).select('fullName profilePicture');
    const userMap = new Map(users.map(u => [u._id.toString(), u]));

    const formattedDoctors = doctors.map(doctor => {
      const user = userMap.get(doctor._id.toString());
      return {
        id: String(doctor._id),
        fullName: user?.fullName || 'Unknown',
        specialization: doctor.specialization,
        experience: doctor.experience,
        consultationFee: doctor.consultationFee,
        rating: doctor.rating,
        profilePicture: doctor.profilePicture || user?.profilePicture || ''
      };
    });

    res.status(200).json({
      success: true,
      count: formattedDoctors.length,
      data: formattedDoctors
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch doctors by specialization',
      error: error.message
    });
  }
};

/**
 * @desc    Get all unique specializations
 * @route   GET /api/doctors/specializations/list
 * @access  Public
 */
export const getSpecializations = async (req, res) => {
  try {
    const specializations = await Doctor.distinct('specialization', { isApproved: true });
    
    res.status(200).json({
      success: true,
      data: specializations
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch specializations',
      error: error.message
    });
  }
};

/**
 * @desc    Get doctor profile (protected)
 * @route   GET /api/doctors/profile
 * @access  Private (Doctor only)
 */
/**
 * @desc    Get doctor profile (protected)
 * @route   GET /api/doctors/profile
 * @access  Private (Doctor only)
 */
export const getDoctorProfile = async (req, res) => {
  try {
    // ✅ Use req.userId (set by auth middleware) instead of req.user.id
    const userId = req.userId || req.user?._id;
    
    // console.log('Getting doctor profile for userId:', userId);
    
    if (!userId) {
      return res.status(401).json({ success: false, message: 'User not authenticated' });
    }
    
    const doctor = await Doctor.findById(userId)
      .populate('_id', 'fullName email profilePicture createdAt');
    
    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor not found' });
    }
    
    res.json({ 
      success: true, 
      data: {
        ...doctor.toObject(),
        isProfileComplete: doctor.isProfileComplete,
        status: doctor.status
      }
    });
  } catch (error) {
    console.error('Get doctor profile error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Update doctor profile
 * @route   PUT /api/doctors/profile
 * @access  Private (Doctor only)
 */
export const updateDoctorProfile = async (req, res) => {
  try {
    const { phoneNumber, bio, clinicAddress, consultationFee, qualifications, availability } = req.body;
    
    const doctor = await Doctor.findById(req.user.id);
    
    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor not found' });
    }
    
    // Update fields
    if (phoneNumber !== undefined) doctor.phoneNumber = phoneNumber;
    if (bio !== undefined) doctor.bio = bio;
    if (consultationFee !== undefined) doctor.consultationFee = consultationFee;
    if (clinicAddress !== undefined) doctor.clinicAddress = clinicAddress;
    if (qualifications !== undefined) doctor.qualifications = qualifications;
    if (availability !== undefined) doctor.availability = availability;
    
    // Reset rejection status if profile was rejected
    if (doctor.isRejected) {
      doctor.isRejected = false;
      doctor.rejectionReason = '';
      doctor.submittedForApproval = false;
      doctor.status = 'pending';
    }
    
    await doctor.save();
    
    res.json({ 
      success: true, 
      data: doctor,
      message: 'Profile updated successfully'
    });
  } catch (error) {
    console.error('Update doctor profile error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Submit doctor profile for approval
 * @route   POST /api/doctors/submit-approval
 * @access  Private (Doctor only)
 */
/**
 * @desc    Submit doctor profile for approval
 * @route   POST /api/doctors/submit-approval
 * @access  Private (Doctor only)
 */
export const submitForApproval = async (req, res) => {
  try {
    const userId = req.userId || req.user?.id || req.user?._id;
    
    if (!userId) {
      return res.status(401).json({ success: false, message: 'User not authenticated' });
    }
    
    const doctor = await Doctor.findById(userId);
    
    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor not found' });
    }
    
    // Check if already approved
    if (doctor.isApproved) {
      return res.status(400).json({ 
        success: false, 
        message: 'Your profile is already approved!' 
      });
    }
    
    // Check if already submitted
    if (doctor.submittedForApproval) {
      return res.status(400).json({ 
        success: false, 
        message: 'Your profile is already pending approval.' 
      });
    }
    
    // Check if profile is complete
    const isComplete = doctor.phoneNumber && 
                       doctor.consultationFee > 0 && 
                       doctor.bio && 
                       doctor.clinicAddress?.street &&
                       doctor.clinicAddress?.city;
    
    if (!isComplete) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please complete your profile first' 
      });
    }
    
    doctor.submittedForApproval = true;
    doctor.submittedAt = new Date();
    await doctor.save();
    
    res.json({ 
      success: true, 
      message: 'Profile submitted for approval successfully!' 
    });
  } catch (error) {
    console.error('Submit for approval error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};


/**
 * @desc    Get doctor's appointments
 * @route   GET /api/doctors/appointments
 * @access  Private (Doctor only)
 */
export const getDoctorAppointments = async (req, res) => {
  try {
    const { status, date, page = 1, limit = 20 } = req.query;
    
    let filter = { doctorId: req.user.id };
    if (status) filter.status = status;
    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(date);
      endDate.setDate(endDate.getDate() + 1);
      filter.date = { $gte: startDate, $lt: endDate };
    }
    
    const skip = (page - 1) * limit;
    
    const appointments = await Appointment.find(filter)
      .populate('patientId', 'fullName email age gender phoneNumber')
      .sort({ date: -1, timeSlot: 1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    const total = await Appointment.countDocuments(filter);
    
    res.json({ 
      success: true, 
      data: appointments,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: parseInt(limit)
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Update appointment status
 * @route   PUT /api/doctors/appointments/:id/status
 * @access  Private (Doctor only)
 */
export const updateAppointmentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const updateData = { status };
    
    if (status === 'completed') {
      updateData.completedAt = new Date();
    }
    
    if (status === 'no-show') {
      updateData.noShowAt = new Date();
    }
    
    const appointment = await Appointment.findOneAndUpdate(
      { _id: id, doctorId: req.user.id },
      updateData,
      { new: true }
    ).populate('patientId', 'fullName email');
    
    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }
    
    if (status === 'completed') {
      await Doctor.findByIdAndUpdate(req.user.id, {
        $inc: { totalConsultations: 1 }
      });
    }
    
    res.json({ success: true, data: appointment });
  } catch (error) {
    console.error('Update appointment status error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Get doctor's patients
 * @route   GET /api/doctors/patients
 * @access  Private (Doctor only)
 */
export const getDoctorPatients = async (req, res) => {
  try {
    const { search, page = 1, limit = 20 } = req.query;
    
    const appointments = await Appointment.find({ doctorId: req.user.id })
      .populate('patientId', 'fullName email age gender phoneNumber')
      .sort({ createdAt: -1 });
    
    const patientMap = new Map();
    appointments.forEach(apt => {
      if (apt.patientId && !patientMap.has(apt.patientId._id.toString())) {
        patientMap.set(apt.patientId._id.toString(), apt.patientId);
      }
    });
    
    let patients = Array.from(patientMap.values());
    
    if (search) {
      patients = patients.filter(p => 
        p.fullName?.toLowerCase().includes(search.toLowerCase()) ||
        p.email?.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    const start = (page - 1) * limit;
    const paginatedPatients = patients.slice(start, start + limit);
    
    res.json({ 
      success: true, 
      data: paginatedPatients,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(patients.length / limit),
        totalItems: patients.length,
        itemsPerPage: parseInt(limit)
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Get doctor stats
 * @route   GET /api/doctors/stats
 * @access  Private (Doctor only)
 */
export const getDoctorStats = async (req, res) => {
  try {
    // ✅ FIX: Use req.userId instead of req.user.id
    const doctorId = req.userId || req.user?.id || req.user?._id;
    
    if (!doctorId) {
      return res.status(401).json({ 
        success: false, 
        message: 'User not authenticated' 
      });
    }
    
    // console.log('Fetching stats for doctorId:', doctorId);
    
    const appointments = await Appointment.find({ doctorId });
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const todayAppointments = appointments.filter(apt => 
      new Date(apt.date) >= today && new Date(apt.date) < tomorrow
    );
    
    const completedAppointments = appointments.filter(apt => apt.status === 'completed');
    const upcomingAppointments = appointments.filter(apt => apt.status === 'confirmed' && new Date(apt.date) > new Date());
    const pendingAppointments = appointments.filter(apt => apt.status === 'pending');
    const noShowAppointments = appointments.filter(apt => apt.status === 'no-show');
    
    const totalEarnings = completedAppointments.reduce((sum, apt) => sum + (apt.amount || apt.fee || 0), 0);
    
    const uniquePatients = new Set(
      completedAppointments.map(apt => apt.patientId?.toString())
    ).size;
    
    res.json({
      success: true,
      data: {
        todayAppointments: todayAppointments.length,
        totalAppointments: appointments.length,
        completedAppointments: completedAppointments.length,
        upcomingAppointments: upcomingAppointments.length,
        pendingAppointments: pendingAppointments.length,
        noShowAppointments: noShowAppointments.length,
        totalPatients: uniquePatients,
        totalEarnings,
        recentAppointments: appointments.slice(0, 5)
      }
    });
  } catch (error) {
    console.error('Get doctor stats error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Get doctor's schedule
 * @route   GET /api/doctors/schedule
 * @access  Private (Doctor only)
 */
export const getDoctorSchedule = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.user.id).select('availability');
    res.json({ success: true, data: doctor?.availability || [] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Update doctor's schedule
 * @route   PUT /api/doctors/schedule
 * @access  Private (Doctor only)
 */
export const updateDoctorSchedule = async (req, res) => {
  try {
    const { availability } = req.body;
    
    const doctor = await Doctor.findByIdAndUpdate(
      req.user.id,
      { availability },
      { new: true }
    ).select('availability');
    
    res.json({ success: true, data: doctor?.availability || [] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Get doctor's schedule by ID (Public)
 * @route   GET /api/doctors/:id/schedule
 * @access  Public
 */
export const getDoctorScheduleById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const doctor = await Doctor.findById(id).select('availability');
    
    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor not found' });
    }
    
    res.json({ success: true, data: doctor?.availability || [] });
  } catch (error) {
    console.error('Get doctor schedule by ID error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Get public doctor profile
 * @route   GET /api/doctors/public/:id
 * @access  Public
 */
export const getPublicDoctorById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const doctor = await Doctor.findById(id);
    
    if (!doctor || !doctor.isApproved) {
      return res.status(404).json({ success: false, message: 'Doctor not found' });
    }
    
    const user = await User.findById(doctor._id).select('fullName email profilePicture');
    
    const formattedDoctor = {
      id: String(doctor._id),
      fullName: user?.fullName || 'Doctor',
      email: user?.email || '',
      profilePicture: doctor.profilePicture || user?.profilePicture || '',
      specialization: doctor.specialization,
      experience: doctor.experience,
      consultationFee: doctor.consultationFee,
      rating: doctor.rating,
      totalConsultations: doctor.totalConsultations,
      clinicAddress: doctor.clinicAddress,
      bio: doctor.bio,
      phoneNumber: doctor.phoneNumber,
      qualifications: doctor.qualifications,
      availability: doctor.availability
    };
    
    res.status(200).json({
      success: true,
      data: formattedDoctor
    });
    
  } catch (error) {
    console.error('Get public doctor by ID error:', error);
    
    if (error.name === 'CastError') {
      return res.status(404).json({ success: false, message: 'Doctor not found' });
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to fetch doctor details',
      error: error.message
    });
  }
};