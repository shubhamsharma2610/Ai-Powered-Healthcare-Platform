import User from '../models/User.js';
import Patient from '../models/Patient.js';
import Doctor from '../models/Doctor.js';
import { generateToken } from '../utils/jwtUtils.js';
import { asyncHandler } from '../utils/errorHandler.js';
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '../constants/roles.js';

/**
 * REGISTER - Create new user (Patient or Doctor)
 * @route POST /api/auth/register
 * @access Public
 */
export const register = asyncHandler(async (req, res) => {
  const { fullName, email, password, confirmPassword, role, ...otherData } = req.body;

  // ✅ ONLY required fields check
  if (!fullName || !email || !password || !role) {
    return res.status(400).json({
      success: false,
      message: "Full name, email, password and role are required",
      statusCode: 400
    });
  }

  // ✅ Check password match only if confirmPassword is provided
  if (confirmPassword && password !== confirmPassword) {
    return res.status(400).json({
      success: false,
      message: "Passwords do not match",
      statusCode: 400
    });
  }

  // Password length check
  if (password.length < 6) {
    return res.status(400).json({
      success: false,
      message: 'Password must be at least 6 characters',
      statusCode: 400
    });
  }

  // Check if email already exists
  const existingUser = await User.findOne({ email: email.toLowerCase() });
  if (existingUser) {
    return res.status(400).json({
      success: false,
      message: 'Email already registered',
      statusCode: 400
    });
  }

  let newUser;

  if (role === 'patient') {
    newUser = new Patient({
      fullName: fullName.trim(),
      email: email.toLowerCase(),
      password,
      role: 'patient',
      age: otherData.age,
      gender: otherData.gender,
      bloodType: otherData.bloodType,
      phoneNumber: otherData.phoneNumber
    });
  } 
  else if (role === 'doctor') {
    const { licenseNumber, specialization, experience } = otherData;

    if (!licenseNumber || !specialization || experience === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Doctor requires license number, specialization, and experience',
        statusCode: 400
      });
    }

    const existingDoctor = await Doctor.findOne({ licenseNumber });
    if (existingDoctor) {
      return res.status(400).json({
        success: false,
        message: 'License number already registered',
        statusCode: 400
      });
    }

    newUser = new Doctor({
      fullName: fullName.trim(),
      email: email.toLowerCase(),
      password,
      role: 'doctor',
      licenseNumber: licenseNumber.trim(),
      specialization,
      experience: parseInt(experience),
      phoneNumber: otherData.phoneNumber,
      bio: otherData.bio,
      clinicAddress: otherData.clinicAddress,
      consultationFee: otherData.consultationFee,
      qualifications: otherData.qualifications || []
    });
  } 
  else {
    return res.status(400).json({
      success: false,
      message: 'Invalid role. Must be patient or doctor',
      statusCode: 400
    });
  }

  await newUser.save();
  const token = generateToken(newUser._id, newUser.role);

  return res.status(201).json({
    success: true,
    message: "Registration successful",
    statusCode: 201
    // token,
    // user: newUser.toJSON()
  });
});
/**
 * LOGIN - Authenticate user with email and password
 * @route POST /api/auth/login
 * @access Public
 */
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Validation
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Email and password are required',
      statusCode: 400
    });
  }

  try {
    // Find user and include password field
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: ERROR_MESSAGES.INVALID_CREDENTIALS,
        statusCode: 401
      });
    }

    // Compare passwords
    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: ERROR_MESSAGES.INVALID_CREDENTIALS,
        statusCode: 401
      });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Your account has been deactivated',
        statusCode: 403
      });
    }

    // Generate JWT token
    const token = generateToken(user._id, user.role);
    res.cookie("token", token, {
      httpOnly: true,
      secure: false, // true in production with HTTPS
      maxAge: 24 * 60 * 60 * 1000
    });

    res.cookie('myToken', token, {
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        sameSite: 'strict'
    });


    return res.status(200).json({
      success: true,
      message: SUCCESS_MESSAGES.LOGIN_SUCCESS,
      statusCode: 200,
      token,
      user: user.toJSON()
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({
      success: false,
      message: ERROR_MESSAGES.SERVER_ERROR,
      statusCode: 500,
      error: error.message
    });
  }
});

/**
 * GET CURRENT USER - Fetch authenticated user info
 * @route GET /api/auth/current-user
 * @access Private
 */
export const getCurrentUser = asyncHandler(async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: ERROR_MESSAGES.USER_NOT_FOUND,
        statusCode: 404
      });
    }

    return res.status(200).json({
      success: true,
      message: 'User profile fetched',
      statusCode: 200,
      user: user.toJSON()
    });
  } catch (error) {
    console.error('Get user error:', error);
    return res.status(500).json({
      success: false,
      message: ERROR_MESSAGES.SERVER_ERROR,
      statusCode: 500
    });
  }
});

/**
 * LOGOUT - Logout user (token-based, no server-side action needed)
 * @route POST /api/auth/logout
 * @access Private
 */
export const logout = asyncHandler(async (req, res) => {
  return res.status(200).json({
    success: true,
    message: SUCCESS_MESSAGES.LOGOUT_SUCCESS,
    statusCode: 200
  });
});

/**
 * VERIFY TOKEN - Verify if token is valid
 * @route GET /api/auth/verify-token
 * @access Private
 */
export const verifyTokenEndpoint = asyncHandler(async (req, res) => {
  return res.status(200).json({
    success: true,
    message: 'Token is valid',
    statusCode: 200,
    user: req.user.toJSON()
  });
});
