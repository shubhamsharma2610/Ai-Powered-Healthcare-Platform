import { Router } from 'express';
import {
  bookAppointment,
  getMyAppointments,
  cancelAppointment,
  updateAppointmentStatus
} from '../controllers/appointmentsController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = Router();

router.use(authMiddleware); // All routes protected

router.post('/', bookAppointment);
router.get('/my-appointments', getMyAppointments);
router.put('/:id/cancel', cancelAppointment);
router.put('/:id/status', updateAppointmentStatus);

export default router;