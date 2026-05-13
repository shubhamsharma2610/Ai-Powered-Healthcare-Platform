import { Router } from 'express';
import {
  register,
  login,
  logout,
  getCurrentUser,
  verifyTokenEndpoint
} from '../controllers/authController.js';
import { authMiddleware, roleMiddleware, guestMiddleware } from '../middleware/authMiddleware.js';

const router = Router();

/**
 * PUBLIC ROUTES
 */

// Register Route - Create new user
// Body: { fullName, email, password, confirmPassword, role, ...otherData }
router.post('/register', register);

// Login Route - Authenticate user
// Body: { email, password }
router.post('/login', login);

/**
 * PROTECTED ROUTES
 */

// Get Current User - Fetch authenticated user profile
router.get('/current-user', authMiddleware, getCurrentUser);

// Verify Token - Check if token is valid
router.get('/verify-token', authMiddleware, verifyTokenEndpoint);

// Logout Route - Logout user
router.post('/logout', authMiddleware, logout);

export default router;
