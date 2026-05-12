import { verifyToken } from '../utils/jwtUtils.js';
import { asyncHandler } from '../utils/errorHandler.js';
import User from '../models/User.js';

// Middleware to verify JWT token
export const authMiddleware = asyncHandler(async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'No token provided',
      statusCode: 401
    });
  }

  const decoded = verifyToken(token);

  if (!decoded) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token',
      statusCode: 401
    });
  }

  const user = await User.findById(decoded.userId);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found',
      statusCode: 404
    });
  }

  if (!user.isActive) {
    return res.status(403).json({
      success: false,
      message: 'User account is inactive',
      statusCode: 403
    });
  }

  // Attach user info to request
  req.user = user;
  req.userId = decoded.userId;
  req.role = decoded.role;

  next();
});

// Middleware to check user role
export const roleMiddleware = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.role || !allowedRoles.includes(req.role)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Insufficient permissions',
        statusCode: 403,
        requiredRole: allowedRoles,
        userRole: req.role
      });
    }
    next();
  };
};

// Middleware to allow only unauthenticated users
export const guestMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (token) {
    return res.status(400).json({
      success: false,
      message: 'You are already authenticated',
      statusCode: 400
    });
  }

  next();
};
