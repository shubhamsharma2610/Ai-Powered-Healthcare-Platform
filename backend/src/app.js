import express from 'express';
import authRoutes from './routes/authRoutes.js';
import doctorRoutes from './routes/doctorRoutes.js';
import appointmentRoutes from './routes/appointmentsRoutes.js';
import { errorHandler } from './utils/errorHandler.js';
import cookieParser from "cookie-parser"
import cors from 'cors';
import dns from "dns";
dns.setServers(['8.8.8.8', '1.1.1.1']);

const app = express();
// app.options('/*', cors());
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000',"https://fantastic-invention-gxq7ggjgvp7xhwww9-5173.app.github.dev/"],
   // Multiple origins
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Handle preflight requests
// app.options('*', cors());

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// Optional: CORS configuration (uncomment if needed)
// import cors from 'cors';
// app.use(cors({
//   origin: process.env.FRONTEND_URL || 'http://localhost:3000',
//   credentials: true,
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
//   allowedHeaders: ['Content-Type', 'Authorization']
// }));

// ==========================================
// ROUTES
// ==========================================

// Auth Routes
app.use('/api/auth', authRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/appointments', appointmentRoutes);
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