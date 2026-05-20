import Doctor from '../models/Doctor.js';
import User from '../models/User.js';

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
      // Need to search in User collection first for names
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
        .populate('_id', 'fullName email profilePicture') // Populate User fields
        .sort(sortOptions)
        .skip(skip)
        .limit(parseInt(limit)),
      Doctor.countDocuments(filter)
    ]);

    // Format response
    const formattedDoctors = doctors.map(doctor => ({
      id: doctor._id._id || doctor._id,
      fullName: doctor._id.fullName,
      email: doctor._id.email,
      profilePicture: doctor.profilePicture || doctor._id.profilePicture,
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
    }));

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
export const getDoctorById = async (req, res) => {
  try {
    const { id } = req.params;

    // Find doctor by ID (either User ID or Doctor ID)
    let doctor;
    
    // First try to find as Doctor document
    doctor = await Doctor.findById(id).populate('_id', 'fullName email profilePicture createdAt');
    
    // If not found, try to find by User ID
    if (!doctor) {
      doctor = await Doctor.findOne({ _id: id }).populate('_id', 'fullName email profilePicture createdAt');
    }

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found'
      });
    }

    // Check if doctor is approved (optional - maybe show pending doctors to admin only)
    if (!doctor.isApproved) {
      // Check if requesting user is admin (you can add this logic)
      // For now, return 404 for unapproved doctors to public
      return res.status(404).json({
        success: false,
        message: 'Doctor not found'
      });
    }

    // Format response
    const formattedDoctor = {
      id: doctor._id._id || doctor._id,
      fullName: doctor._id.fullName,
      email: doctor._id.email,
      profilePicture: doctor.profilePicture || doctor._id.profilePicture,
      createdAt: doctor._id.createdAt,
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

    // Increment view count (optional - if you want to track profile views)
    // await Doctor.findByIdAndUpdate(doctor._id, { $inc: { profileViews: 1 } });

    res.status(200).json({
      success: true,
      data: formattedDoctor
    });

  } catch (error) {
    console.error('Get doctor by ID error:', error);
    
    // Check if it's a mongoose invalid ID error
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
 * @desc    Get doctor by specialization (for filtering)
 * @route   GET /api/doctors/specializations/:specialization
 * @access  Public
 */
export const getDoctorsBySpecialization = async (req, res) => {
  try {
    const { specialization } = req.params;
    
    const doctors = await Doctor.find({
      specialization: { $regex: new RegExp(`^${specialization}$`, 'i') },
      isApproved: true
    }).populate('_id', 'fullName email profilePicture');

    const formattedDoctors = doctors.map(doctor => ({
      id: doctor._id._id || doctor._id,
      fullName: doctor._id.fullName,
      specialization: doctor.specialization,
      experience: doctor.experience,
      consultationFee: doctor.consultationFee,
      rating: doctor.rating,
      profilePicture: doctor.profilePicture || doctor._id.profilePicture
    }));

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