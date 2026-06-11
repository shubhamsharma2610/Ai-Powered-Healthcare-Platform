import { GoogleGenerativeAI } from '@google/generative-ai';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import authRoutes from './routes/authRoutes.js';
import doctorRoutes from './routes/doctorRoutes.js';
import appointmentRoutes from './routes/appointmentsRoutes.js';
import patientRoutes from './routes/patientRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js'; 
import aiRoutes from './routes/aiRoutes.js'; 
import refundRoutes from './routes/refundRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import { testGemini } from './controllers/testAiController.js'; 
import { errorHandler } from './utils/errorHandler.js';
import cookieParser from "cookie-parser";
import dns from "dns";

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dns.setServers(['8.8.8.8', '1.1.1.1']);

const app = express();

// ==========================================
// CREATE UPLOADS DIRECTORY IF NOT EXISTS
// ==========================================
const uploadsDir = path.join(__dirname, 'uploads');
const documentsDir = path.join(uploadsDir, 'documents');

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log('📁 Created uploads directory');
}

if (!fs.existsSync(documentsDir)) {
  fs.mkdirSync(documentsDir, { recursive: true });
  console.log('📁 Created documents directory');
}

// ==========================================
// SERVE STATIC FILES (UPLOADS)
// ==========================================
// ✅ This allows uploaded files to be accessed via URL
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
console.log('📁 Static files served from: /uploads');

// ==========================================
// CORS CONFIGURATION
// ==========================================
app.use((req, res, next) => {
  const origin = req.headers.origin;

  // Build allowed origins list (filter out undefined)
  const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:3000',
    'https://ai-powered-healthcare-platform-frontend.onrender.com',
    process.env.FRONTEND_URL
  ].filter(Boolean);

  // Log origin for debugging CORS issues in production
  if (process.env.NODE_ENV === 'production') {
    console.log('🔐 CORS check - origin:', origin, 'allowed:', allowedOrigins.includes(origin));
  }

  // If the request origin matches an allowed origin, echo it back (required when using credentials)
  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }

  // Always expose these headers for preflight and credentialed requests
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Max-Age', '86400');

  // For preflight requests, ensure headers are sent before ending the response
  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  next();
});

// ==========================================
// MIDDLEWARE
// ==========================================
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// ==========================================
// ROUTES
// ==========================================
app.use('/api/auth', authRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/refunds', refundRoutes);
app.use('/api/admin', adminRoutes);

// Test routes
app.get('/test', testGemini);

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.get('/aitest', async (req, res) => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    const prompt = "Say 'Hello, Gemini is working!'";
    const result = await model.generateContent(prompt);
    res.json({ success: true, message: result.response.text() });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    status: 'healthy',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Test Endpoint
app.get('/api/test', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running!',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// ==========================================
// ERROR HANDLING
// ==========================================

// 404 Not Found Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    statusCode: 404,
    message: `Route ${req.method} ${req.path} not found`
  });
});

// Global Error Handler (Must be last)
app.use(errorHandler);

export default app;