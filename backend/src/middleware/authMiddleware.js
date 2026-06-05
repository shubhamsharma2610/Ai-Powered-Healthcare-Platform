import { verifyToken } from '../utils/jwtUtils.js';
import { asyncHandler } from '../utils/errorHandler.js';
import User from '../models/User.js';

// Middleware to verify JWT token
export const authMiddleware = asyncHandler(async (req, res, next) => {
  let token = req.cookies?.token || req.cookies?.myToken;
  
  if (!token && req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

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

  // ✅ FIXED: Attach user with consistent properties
  req.user = user;
  req.userId = decoded.userId;
  req.role = decoded.role;
  
  // ✅ ADD THIS: Also attach id for easy access
  req.user.id = user._id; // Ensure id is available
  
  // // console.log('Auth middleware - User attached:', {
  // //   id: req.user.id,
  // //   role: req.role,
  // //   email: user.email
  // // });

  next();
});

// ✅ FIXED: Role Middleware - Case Insensitive with Error Handling
export const roleMiddleware = (...allowedRoles) => {
  return (req, res, next) => {
    try {
      // Ensure allowedRoles is an array
      const allowedRolesArray = Array.isArray(allowedRoles) ? allowedRoles : [];
      
      // Safely convert user role to string and lowercase
      const userRole = req.role ? String(req.role).toLowerCase() : null;
      
      // Safely convert allowed roles to lowercase strings
      const allowedLower = allowedRolesArray.map(r => String(r).toLowerCase());
      
      if (!userRole || !allowedLower.includes(userRole)) {
        return res.status(403).json({
          success: false,
          message: 'Access denied. Insufficient permissions',
          statusCode: 403,
          requiredRole: allowedRolesArray,
          userRole: req.role
        });
      }
      next();
    } catch (error) {
      // console.error('Role middleware error:', error);
      return res.status(500).json({
        success: false,
        message: 'Internal server error in role check'
      });
    }
  };
};

// Middleware to allow only unauthenticated users
export const guestMiddleware = (req, res, next) => {
  let token = req.cookies?.token || req.cookies?.myToken;
  if (!token && req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (token) {
    return res.status(400).json({
      success: false,
      message: 'You are already authenticated',
      statusCode: 400
    });
  }

  next();
};