import { GoogleGenerativeAI } from '@google/generative-ai';
import express from 'express';
import authRoutes from './routes/authRoutes.js';
import doctorRoutes from './routes/doctorRoutes.js';
import appointmentRoutes from './routes/appointmentsRoutes.js';
import patientRoutes from './routes/patientRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js'; 
import aiRoutes from './routes/aiRoutes.js'; 
import refundRoutes from './routes/refundRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import  {testGemini}  from './controllers/testAiController.js'; 
import { errorHandler } from './utils/errorHandler.js';
import cookieParser from "cookie-parser"
import cors from 'cors';
import dns from "dns";
dns.setServers(['8.8.8.8', '1.1.1.1']);

const app = express();
// app.options('/*', cors());
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000',"https://fantastic-invention-gxq7ggjgvp7xhwww9-5173.app.github.dev","https://fantastic-invention-gxq7ggjgvp7xhwww9.github.dev",
    "https://fantastic-invention-gxq7ggjgvp7xhwww9-5173.app.github.dev"
  ],
   // Multiple origins
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));
// app.use(cors({
//   origin: '*',  // 👈 Star = All origins allowed
//   credentials: true,
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
//   allowedHeaders: ['Content-Type', 'Authorization']
// }));
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

app.use('/api/payments', paymentRoutes);

app.use('/api/patients', patientRoutes);

app.use('/api/ai', aiRoutes);
app.use('/api/refunds', refundRoutes);

app.use('/api/admin', adminRoutes);

app.get('/test', testGemini);

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Temporary test route - remove after testing
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