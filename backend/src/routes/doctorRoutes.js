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
  updateDoctorSchedule,
  getDoctorScheduleById,
  getPublicDoctorById
} from '../controllers/doctorController.js';
import { authMiddleware, roleMiddleware } from '../middleware/authMiddleware.js';

const router = Router();
router.get('/', getAllDoctors);
router.get('/specializations', getSpecializations);
router.get('/specializations/:specialization', getDoctorsBySpecialization);
router.get('/:id/schedule', getDoctorScheduleById);
router.get('/public/:id', getPublicDoctorById);  // 👈 Patient sees doctor profile

// ============ PROTECTED ROUTES (Doctor only) ============
router.use(authMiddleware);
router.use(roleMiddleware(['doctor']));

router.get('/profile', getDoctorProfile);
router.put('/profile', updateDoctorProfile);
router.get('/stats', getDoctorStats);
router.get('/appointments', getDoctorAppointments);
router.put('/appointments/:id/status', updateAppointmentStatus);
router.get('/patients', getDoctorPatients);
router.get('/schedule', getDoctorSchedule);
router.put('/schedule', updateDoctorSchedule);
router.get('/:id', getDoctorById);  // 👈 Doctor viewing their own profile

export default router;