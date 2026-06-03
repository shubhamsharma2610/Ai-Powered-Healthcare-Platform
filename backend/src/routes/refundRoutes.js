import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { getRefundStatusByAppointment, getMyRefunds } from '../controllers/refundController.js';

const router = express.Router();

router.use(authMiddleware);

// Get refund status for a specific appointment
router.get('/status/:appointmentId', getRefundStatusByAppointment);

// Get all refunds for the logged-in patient
router.get('/my-refunds', getMyRefunds);

export default router;