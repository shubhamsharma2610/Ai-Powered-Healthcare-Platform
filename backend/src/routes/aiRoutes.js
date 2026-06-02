import express from 'express';
import { analyzeReport, upload } from '../controllers/aiController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authMiddleware);
router.post('/analyze', upload.single('report'), analyzeReport);

export default router;