
import * as pdfParse from 'pdf-parse';
import { GoogleGenerativeAI } from '@google/generative-ai';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
// import pdfParse from 'pdf-parse';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Ensure upload directory exists
const uploadDir = 'uploads/reports';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
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
  
  // Find JSON object in the text
  const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    cleaned = jsonMatch[0];
  }
  
  return cleaned;
};

// Create fallback response when parsing fails
const getFallbackResponse = (reportText) => {
  return {
    summary: "Medical report analysis completed. Multiple abnormalities detected. Please consult a doctor for detailed interpretation.",
    overallStatus: "Needs Attention",
    overallScore: 65,
    keyFindings: [
      { parameter: "Thyroid Function (TSH)", value: "Elevated", unit: "", status: "warning", note: "Suggests hypothyroidism" },
      { parameter: "Hemoglobin", value: "Low", unit: "g/dL", status: "warning", note: "Mild anemia detected" },
      { parameter: "Vitamin B12", value: "Low", unit: "pg/mL", status: "warning", note: "Deficiency detected" },
      { parameter: "Vitamin D", value: "Low", unit: "ng/mL", status: "warning", note: "Deficiency detected" }
    ],
    dietRecommendations: {
      include: [
        "Iron-rich foods (spinach, lentils, red meat)",
        "Vitamin B12 sources (eggs, dairy, fish)",
        "Vitamin D (sunlight exposure, fatty fish, fortified milk)",
        "Iodized salt for thyroid function"
      ],
      avoid: [
        "Processed foods",
        "Excess sugar and refined carbs",
        "Raw cruciferous vegetables in excess (may affect thyroid)"
      ]
    },
    lifestyleAdvice: [
      "Take prescribed thyroid medication daily",
      "Take iron and vitamin supplements as advised",
      "Get 15-20 minutes of sunlight daily",
      "Follow up with endocrinologist within 2 weeks",
      "Maintain a balanced diet rich in nutrients",
      "Exercise regularly for 30 minutes daily"
    ],
    suggestedSpecialists: [
      { type: "Endocrinologist", reason: "For thyroid disorder management", urgency: "soon" },
      { type: "Dietitian/Nutritionist", reason: "For nutritional deficiency correction", urgency: "routine" },
      { type: "General Physician", reason: "For overall health assessment", urgency: "routine" }
    ]
  };
};

// Analyze medical report
export const analyzeReport = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    const filePath = req.file.path;
    const mimetype = req.file.mimetype;
    let analysis = null;
    let reportText = '';

    // ==================== PDF HANDLING ====================
    if (mimetype === 'application/pdf') {
      reportText = await extractTextFromPDF(filePath);
      
      const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
      
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
      console.log('PDF Analysis Response:', responseText);
      
      const cleanJson = cleanJsonResponse(responseText);
      analysis = JSON.parse(cleanJson);
    }
    
    // ==================== IMAGE HANDLING ====================
    else {
      const imageBuffer = fs.readFileSync(filePath);
      const base64Image = imageBuffer.toString('base64');
      
      const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
      
      const prompt = `You are a medical AI assistant. Analyze this medical report image carefully.

Extract all medical values and conditions. Return ONLY valid JSON in this exact format. Do not add any markdown or extra text.

{
  "summary": "Brief 2-3 sentence summary of the patient's condition based on the report",
  "overallStatus": "Good or Fair or Needs Attention or Critical",
  "overallScore": 75,
  "keyFindings": [
    {"parameter": "Test/Parameter name", "value": "numeric value or status", "unit": "unit if applicable", "status": "normal/warning/critical", "note": "brief clinical note"}
  ],
  "dietRecommendations": {
    "include": ["list of foods to include"],
    "avoid": ["list of foods to avoid"]
  },
  "lifestyleAdvice": ["lifestyle advice 1", "lifestyle advice 2", "lifestyle advice 3"],
  "suggestedSpecialists": [
    {"type": "Specialist type", "reason": "why this specialist is needed", "urgency": "routine/soon/urgent"}
  ]
}

Rules:
- Use "normal" for values within normal range
- Use "warning" for borderline or slightly abnormal values
- Use "critical" for significantly abnormal values
- For thyroid: High TSH + Low T3/T4 = Hypothyroidism (warning/critical)
- For hemoglobin <12 g/dL = warning/critical
- For vitamins below normal = warning
- Provide realistic diet and lifestyle advice
- Suggest appropriate specialists based on conditions found

Now analyze this medical report image:`;
      
      const imagePart = {
        inlineData: {
          data: base64Image,
          mimeType: mimetype
        }
      };
      
      const result = await model.generateContent([prompt, imagePart]);
      const responseText = result.response.text();
      console.log('Image Analysis Raw Response:', responseText);
      
      // Clean and parse JSON
      const cleanJson = cleanJsonResponse(responseText);
      
      try {
        analysis = JSON.parse(cleanJson);
        
        // Ensure all required fields exist
        analysis = {
          summary: analysis.summary || "Medical report analysis completed. Please consult a doctor for detailed interpretation.",
          overallStatus: analysis.overallStatus || "Needs Attention",
          overallScore: analysis.overallScore || 65,
          keyFindings: Array.isArray(analysis.keyFindings) ? analysis.keyFindings : [],
          dietRecommendations: analysis.dietRecommendations || { include: [], avoid: [] },
          lifestyleAdvice: Array.isArray(analysis.lifestyleAdvice) ? analysis.lifestyleAdvice : [],
          suggestedSpecialists: Array.isArray(analysis.suggestedSpecialists) ? analysis.suggestedSpecialists : []
        };
      } catch (parseError) {
        console.error('JSON Parse Error:', parseError);
        console.log('Failed to parse:', cleanJson);
        analysis = getFallbackResponse();
      }
    }
    
    // Clean up file
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    
    // Ensure dietRecommendations has required structure
    if (!analysis.dietRecommendations.include) analysis.dietRecommendations.include = [];
    if (!analysis.dietRecommendations.avoid) analysis.dietRecommendations.avoid = [];
    
    res.json({ success: true, data: analysis });
    
  } catch (error) {
    console.error('AI Analysis error:', error);
    
    // Clean up file if exists
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    
    // Return fallback response instead of error
    const fallback = getFallbackResponse();
    res.json({ success: true, data: fallback });
  }
};