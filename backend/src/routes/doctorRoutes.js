import { Router } from 'express';
import {
  getAllDoctors,
  getDoctorById,
  getDoctorsBySpecialization,
  getSpecializations,
  getDoctorProfile,
  updateDoctorProfile,
  getDoctorAppointments,
  getDoctorPatients,
  getDoctorStats,
  updateAppointmentStatus,
  getDoctorSchedule,
  updateDoctorSchedule
} from '../controllers/doctorController.js';
import { authMiddleware, roleMiddleware } from '../middleware/authMiddleware.js';

const router = Router();

// ============ PUBLIC ROUTES ============
router.get('/', getAllDoctors);
router.get('/specializations', getSpecializations);
router.get('/specializations/:specialization', getDoctorsBySpecialization);

// ============ PROTECTED ROUTES (Doctor only) ============
router.use(authMiddleware);
router.use(roleMiddleware(['doctor']));

// ✅ IMPORTANT: Specific routes BEFORE dynamic routes (/:id)
router.get('/profile', getDoctorProfile);
router.put('/profile', updateDoctorProfile);
router.get('/stats', getDoctorStats);
router.get('/appointments', getDoctorAppointments);
router.put('/appointments/:id/status', updateAppointmentStatus);
router.get('/patients', getDoctorPatients);
router.get('/schedule', getDoctorSchedule);
router.put('/schedule', updateDoctorSchedule);

// ✅ Dynamic route MUST be LAST
router.get('/:id', getDoctorById);

export default router;