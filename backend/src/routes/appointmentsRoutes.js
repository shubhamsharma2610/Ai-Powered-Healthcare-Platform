import { Router } from 'express';
import {
  bookAppointment,
  getMyAppointments,
  cancelAppointment,
  updateAppointmentStatus,
  getAppointmentById,
  checkRefundEligibilityAPI,
  getCompletedAppointments  // 👈 Add this if exists
} from '../controllers/appointmentsController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = Router();

router.use(authMiddleware);

router.post('/', bookAppointment);
router.get('/my-appointments', getMyAppointments);
router.get('/:id', getAppointmentById);
router.put('/:id/cancel', cancelAppointment);
router.put('/:id/status', updateAppointmentStatus);
router.get('/:id/refund-eligibility', checkRefundEligibilityAPI);
router.get('/doctor/completed', getCompletedAppointments);  // Optional

export default router;