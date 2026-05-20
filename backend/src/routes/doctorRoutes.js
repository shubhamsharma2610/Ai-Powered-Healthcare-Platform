import { Router } from 'express';
import {
  getAllDoctors,
  getDoctorById,
  getDoctorsBySpecialization,
  getSpecializations
} from '../controllers/doctorController.js';

const router = Router();

/**
 * PUBLIC ROUTES (No authentication required)
 */

// Get all doctors with filters and pagination
router.get('/', getAllDoctors);

// Get all unique specializations
router.get('/specializations', getSpecializations);

// Get doctors by specialization
router.get('/specializations/:specialization', getDoctorsBySpecialization);

// Get single doctor by ID
router.get('/:id', getDoctorById);

export default router;