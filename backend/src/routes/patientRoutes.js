import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { 
  getPatientProfile, 
  updatePatientProfile, 
  getPatientAppointments,
  getTransactionHistory  // 👈 Add this
} from '../controllers/patientController.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/profile', getPatientProfile);
router.put('/profile', updatePatientProfile);
router.get('/appointments', getPatientAppointments);
router.get('/transactions', getTransactionHistory);  // 👈 Add this route

export default router;