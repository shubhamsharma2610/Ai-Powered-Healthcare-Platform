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
  getPublicDoctorById,
  submitForApproval,
  uploadDocument
} from '../controllers/doctorController.js';
import { authMiddleware, roleMiddleware } from '../middleware/authMiddleware.js';

import { upload, handleUploadError } from '../middleware/uploadMiddleware.js';

const router = Router();

// ============ PUBLIC ROUTES (No authentication) ============
router.get('/specializations', getSpecializations);
router.get('/public/:id', getPublicDoctorById);
router.get('/specializations/:specialization', getDoctorsBySpecialization);
router.get('/:id/schedule', getDoctorScheduleById);
router.get('/', getAllDoctors);

// ============ PROTECTED ROUTES (Doctor only) ============
// These routes MUST come AFTER public routes
router.use(authMiddleware);
router.use(roleMiddleware('doctor'));

// Profile routes
router.get('/profile', getDoctorProfile);
router.put('/profile', updateDoctorProfile);
router.post('/submit-approval', submitForApproval);
// router.post('/upload-document', upload.single('document'), handleUploadError, uploadDocument);
router.post(
  '/upload-document',
  authMiddleware,
  roleMiddleware('doctor'),
  upload.single('document'),
  handleUploadError,
  uploadDocument
);
// Stats and Appointments
router.get('/stats', getDoctorStats);
router.get('/appointments', getDoctorAppointments);
router.put('/appointments/:id/status', updateAppointmentStatus);

// Patients and Schedule
router.get('/patients', getDoctorPatients);
router.get('/schedule', getDoctorSchedule);
router.put('/schedule', updateDoctorSchedule);
router.get('/:id', getDoctorById);

export default router;