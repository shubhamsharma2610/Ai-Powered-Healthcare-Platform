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

// Configure multer
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

// Extract text from PDF
const extractTextFromPDF = async (filePath) => {
  const dataBuffer = fs.readFileSync(filePath);
  const data = await pdfParse(dataBuffer);
  return data.text;
};

// Clean JSON from markdown and extra text
const cleanJsonResponse = (text) => {
  let cleaned = text.trim();
  cleaned = cleaned.replace(/```json\n?/g, '');
  cleaned = cleaned.replace(/```\n?/g, '');
  cleaned = cleaned.replace(/```/g, '');
  
  // Find JSON object in the text
  const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    cleaned = jsonMatch[0];
  }
  
  // Fix trailing commas (common Gemini issue)
  cleaned = cleaned.replace(/,\s*}/g, '}');
  cleaned = cleaned.replace(/,\s*]/g, ']');
  
  return cleaned;
};

// Analyze medical report
export const analyzeReport = async (req, res) => {
  try {
    // Check if file exists
    if (!req.file) {
      return res.status(400).json({ 
        success: false, 
        message: 'No file uploaded. Please select a PDF or image file.' 
      });
    }

    const filePath = req.file.path;
    const mimetype = req.file.mimetype;
    let analysis = null;
    let reportText = '';

    console.log('🩺 Analyzing report...');

    // ==================== PDF HANDLING ====================
    if (mimetype === 'application/pdf') {
      console.log('📄 Processing PDF file...');
      reportText = await extractTextFromPDF(filePath);
      
      // Check if text was extracted
      if (!reportText || reportText.trim().length < 50) {
        fs.unlinkSync(filePath);
        return res.status(400).json({ 
          success: false, 
          message: 'Could not extract text from PDF. Please ensure the PDF contains readable text.' 
        });
      }
      
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      
      const prompt = `
        You are a medical AI assistant. Analyze the following medical report and return ONLY valid JSON.
        
        Medical Report Text:
        ${reportText.substring(0, 15000)}
        
        Return JSON in this exact format. Do not add any extra text:
        {
          "summary": "Brief patient summary in 2-3 sentences",
          "overallStatus": "Good or Fair or Needs Attention or Critical",
          "overallScore": 85,
          "keyFindings": [
            { "parameter": "Test name", "value": "value", "unit": "unit", "status": "normal or warning or critical", "note": "optional note" }
          ],
          "dietRecommendations": {
            "include": ["food1", "food2"],
            "avoid": ["food1", "food2"]
          },
          "lifestyleAdvice": ["advice1", "advice2"],
          "suggestedSpecialists": [
            { "type": "Cardiologist", "reason": "reason", "urgency": "routine or soon or urgent" }
          ]
        }
      `;
      
      const result = await model.generateContent(prompt);
      const responseText = result.response.text();
      console.log('✅ AI Response received');
      
      const cleanJson = cleanJsonResponse(responseText);
      analysis = JSON.parse(cleanJson);
      console.log('✅ JSON parsed successfully');
    }
    
    // ==================== IMAGE HANDLING ====================
    else if (mimetype.startsWith('image/')) {
      console.log('🖼️ Processing Image file...');
      const imageBuffer = fs.readFileSync(filePath);
      const base64Image = imageBuffer.toString('base64');
      
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      
      const prompt = `You are a medical AI assistant. Analyze this medical report image carefully.

Return ONLY valid JSON in this exact format. No markdown, no extra text, no explanations.

{
  "summary": "Brief 2-3 sentence summary",
  "overallStatus": "Good or Fair or Needs Attention or Critical",
  "overallScore": 75,
  "keyFindings": [
    {"parameter": "Test name", "value": "value", "unit": "unit", "status": "normal/warning/critical", "note": "note"}
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
      
      const imagePart = {
        inlineData: {
          data: base64Image,
          mimeType: mimetype
        }
      };
      
      const result = await model.generateContent([prompt, imagePart]);
      const responseText = result.response.text();
      console.log('✅ AI Response received for image');
      
      const cleanJson = cleanJsonResponse(responseText);
      analysis = JSON.parse(cleanJson);
      console.log('✅ JSON parsed successfully');
    }
    
    // Unsupported file type
    else {
      fs.unlinkSync(filePath);
      return res.status(400).json({ 
        success: false, 
        message: 'Unsupported file type. Please upload PDF, JPG, or PNG files.' 
      });
    }
    
    // Clean up uploaded file
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log('🗑️ Temporary file deleted');
    }
    
    // Validate analysis has required fields
    if (!analysis || !analysis.summary) {
      throw new Error('AI response missing required fields');
    }
    
    // Ensure all required fields exist
    const finalAnalysis = {
      summary: analysis.summary || "Medical report analysis completed.",
      overallStatus: analysis.overallStatus || "Needs Attention",
      overallScore: analysis.overallScore || 70,
      keyFindings: Array.isArray(analysis.keyFindings) ? analysis.keyFindings : [],
      dietRecommendations: {
        include: analysis.dietRecommendations?.include || [],
        avoid: analysis.dietRecommendations?.avoid || []
      },
      lifestyleAdvice: Array.isArray(analysis.lifestyleAdvice) ? analysis.lifestyleAdvice : [],
      suggestedSpecialists: Array.isArray(analysis.suggestedSpecialists) ? analysis.suggestedSpecialists : []
    };
    
    console.log('📊 Analysis complete');
    res.json({ success: true, data: finalAnalysis });
    
  } catch (error) {
    console.error('❌ AI Analysis error:', error.message);
    
    // Clean up file if exists
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    
    // Check for rate limit or quota errors
    if (error.message?.includes('429') || error.message?.includes('quota')) {
      return res.status(429).json({ 
        success: false, 
        message: 'AI service is busy. Many people are using it right now. Please try again in a few minutes.',
        error: 'RATE_LIMIT_EXCEEDED'
      });
    }
    
    // Check for API key errors
    if (error.message?.includes('API key') || error.message?.includes('auth')) {
      return res.status(401).json({ 
        success: false, 
        message: 'AI service authentication failed. Please contact support.',
        error: 'AUTH_ERROR'
      });
    }
    
    // Generic error
    res.status(500).json({ 
      success: false, 
      message: 'Unable to analyze the report at this time. Please try again later.',
      error: error.message
    });
  }
};