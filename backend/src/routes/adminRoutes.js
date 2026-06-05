import express from 'express';
import { 
  getPendingDoctors,
  getAllDoctorsAdmin,
  getAllPatientsAdmin,
  approveDoctor,
  rejectDoctor,
  getAdminStats,
  getDoctorDetails  // ✅ Add this import
} from '../controllers/adminController.js';
import { authMiddleware, roleMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// All admin routes require authentication and admin role
router.use(authMiddleware);
router.use(roleMiddleware(['admin']));

// Dashboard stats
router.get('/stats', getAdminStats);

// Doctor management
router.get('/pending-doctors', getPendingDoctors);
router.get('/doctors', getAllDoctorsAdmin);
router.get('/doctor/:id', getDoctorDetails);  // ✅ Add this route for viewing single doctor details
router.put('/approve-doctor/:id', approveDoctor);
router.put('/reject-doctor/:id', rejectDoctor);

// Patient management
router.get('/patients', getAllPatientsAdmin);

export default router;