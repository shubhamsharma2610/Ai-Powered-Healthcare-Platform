import * as pdfParse from 'pdf-parse';
import { GoogleGenerativeAI } from '@google/generative-ai';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Ensure upload directory exists
const uploadDir = path.join(__dirname, '../uploads/reports');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log('📁 Created uploads/reports directory');
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

export const upload = multer({
  storage,
  limits: { fileSize: 20 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF, JPG, PNG files are allowed'));
    }
  }
});

const extractTextFromPDF = async (filePath) => {
  const dataBuffer = fs.readFileSync(filePath);
  const data = await pdfParse(dataBuffer);
  return data.text;
};

const cleanJsonResponse = (text) => {
  let cleaned = text.trim();
  cleaned = cleaned.replace(/```json\n?/g, '');
  cleaned = cleaned.replace(/```\n?/g, '');
  cleaned = cleaned.replace(/```/g, '');
  
  const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    cleaned = jsonMatch[0];
  }
  
  cleaned = cleaned.replace(/,\s*}/g, '}');
  cleaned = cleaned.replace(/,\s*]/g, ']');
  
  return cleaned;
};

export const analyzeReport = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ 
        success: false, 
        message: 'No file uploaded' 
      });
    }

    const filePath = req.file.path;
    const mimetype = req.file.mimetype;
    let analysis = null;

    console.log('🩺 Analyzing report...');

    // Select model (allow override via env). Primary: gemini-2.5-flash, fallback: gemini-1.5-flash
    const defaultModel = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
    console.log(`🧠 Selected model: ${defaultModel}`);

    // Helper: try generation with retries for transient errors and fallback to older model if unavailable
    const generateWithRetry = async (input) => {
      const modelsToTry = [defaultModel, 'gemini-1.5-flash'];
      let lastError = null;

      for (const modelName of modelsToTry) {
        const localModel = genAI.getGenerativeModel({ model: modelName });
        for (let attempt = 1; attempt <= 3; attempt++) {
          try {
            console.log(`🔁 Generating with ${modelName} (attempt ${attempt})`);
            const out = await localModel.generateContent(input);
            return { out, modelName };
          } catch (err) {
            lastError = err;
            const msg = (err.message || '').toLowerCase();
            // Retry on rate limit / quota
            if (msg.includes('429') || msg.includes('quota') || msg.includes('rate limit')) {
              const delay = 500 * Math.pow(2, attempt);
              console.warn(`Rate limited by AI service, retrying after ${delay}ms...`);
              await new Promise((r) => setTimeout(r, delay));
              continue;
            }
            // If model not found / not available, break to try next model
            if (msg.includes('model') && (msg.includes('not') || msg.includes('unavailable') || msg.includes('not found'))) {
              console.warn(`Model ${modelName} not available, trying next fallback model`);
              break;
            }
            // For other errors, do not retry this model
            break;
          }
        }
      }
      throw lastError;
    };

    if (mimetype === 'application/pdf') {
      console.log('📄 Processing PDF...');
      const reportText = await extractTextFromPDF(filePath);
      
      const prompt = `Analyze this medical report and return ONLY valid JSON. No markdown.

Report: ${reportText.substring(0, 10000)}

Return JSON format:
{
  "summary": "brief summary",
  "overallStatus": "Good or Fair or Needs Attention or Critical",
  "overallScore": 85,
  "keyFindings": [
    {"parameter": "test name", "value": "value", "unit": "unit", "status": "normal/warning/critical", "note": "note"}
  ],
  "dietRecommendations": {
    "include": ["food1", "food2"],
    "avoid": ["food1", "food2"]
  },
  "lifestyleAdvice": ["advice1", "advice2"],
  "suggestedSpecialists": [
    {"type": "Specialist", "reason": "reason", "urgency": "routine/soon/urgent"}
  ]
}`;

      const { out: result, modelName: usedModel } = await generateWithRetry(prompt);
      const responseText = result.response.text();
      const cleanJson = cleanJsonResponse(responseText);
      analysis = JSON.parse(cleanJson);
      
    } else if (mimetype.startsWith('image/')) {
      console.log('🖼️ Processing Image...');
      const imageBuffer = fs.readFileSync(filePath);
      const base64Image = imageBuffer.toString('base64');
      
      const imagePart = {
        inlineData: {
          data: base64Image,
          mimeType: mimetype
        }
      };
      
      const prompt = `Analyze this medical report image and return ONLY valid JSON. No markdown.

Return JSON format:
{
  "summary": "brief summary",
  "overallStatus": "Good or Fair or Needs Attention or Critical",
  "overallScore": 85,
  "keyFindings": [
    {"parameter": "test name", "value": "value", "unit": "unit", "status": "normal/warning/critical", "note": "note"}
  ],
  "dietRecommendations": {
    "include": ["food1", "food2"],
    "avoid": ["food1", "food2"]
  },
  "lifestyleAdvice": ["advice1", "advice2"],
  "suggestedSpecialists": [
    {"type": "Specialist", "reason": "reason", "urgency": "routine/soon/urgent"}
  ]
}`;
      
      const { out: result, modelName: usedModel } = await generateWithRetry([prompt, imagePart]);
      const responseText = result.response.text();
      const cleanJson = cleanJsonResponse(responseText);
      analysis = JSON.parse(cleanJson);
    } else {
      fs.unlinkSync(filePath);
      return res.status(400).json({ 
        success: false, 
        message: 'Unsupported file type. Please upload PDF, JPG, or PNG.' 
      });
    }
    
    // Clean up file
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    
    console.log('✅ Analysis complete');
    res.json({ success: true, data: analysis });
    
  } catch (error) {
    console.error('❌ AI Error:', error.message);
    
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    
    // Check for rate limit
    if (error.message?.includes('429') || error.message?.includes('quota')) {
      return res.status(429).json({ 
        success: false, 
        message: 'AI service is busy. Many people are using it right now. Please try again in a few minutes.',
        error: 'RATE_LIMIT_EXCEEDED'
      });
    }
    
    res.status(500).json({ 
      success: false, 
      message: 'Unable to analyze the report at this time. Please try again later.',
      error: error.message
    });
  }
};