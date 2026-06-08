import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create upload directories if they don't exist
const uploadDir = path.join(__dirname, '../uploads');
const documentsDir = path.join(uploadDir, 'documents');

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log('📁 Created uploads directory');
}

if (!fs.existsSync(documentsDir)) {
  fs.mkdirSync(documentsDir, { recursive: true });
  console.log('📁 Created documents directory');
}

// ✅ Allowed file types
const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
const allowedExtensions = ['.jpg', '.jpeg', '.png', '.pdf'];

// ✅ File filter for validation
const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  const isValidMime = allowedMimeTypes.includes(file.mimetype);
  const isValidExt = allowedExtensions.includes(ext);
  
  if (isValidMime && isValidExt) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, and PDF files are allowed.'), false);
  }
};

// ✅ Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, documentsDir);
  },
  filename: (req, file, cb) => {
    const documentType = req.body.type || 'document';
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    const fileName = `doctor-${req.user?.id || req.userId}-${documentType}-${uniqueSuffix}${ext}`;
    cb(null, fileName);
  }
});

// ✅ Configure multer with limits and validation
export const upload = multer({ 
  storage, 
  fileFilter,
  limits: { 
    fileSize: 5 * 1024 * 1024 // 5MB max file size
  }
});

// ✅ Error handler for multer errors
export const handleUploadError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ 
        success: false, 
        message: 'File too large. Maximum size is 5MB.' 
      });
    }
    if (err.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({ 
        success: false, 
        message: 'Too many files. Only one file allowed.' 
      });
    }
    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({ 
        success: false, 
        message: 'Unexpected field. Please check the file field name.' 
      });
    }
    return res.status(400).json({ 
      success: false, 
      message: err.message 
    });
  }
  
  if (err.message && err.message.includes('Invalid file type')) {
    return res.status(400).json({ 
      success: false, 
      message: err.message 
    });
  }
  
  next(err);
};

// ✅ Helper function to delete old file (optional)
export const deleteOldFile = (filePath) => {
  if (filePath && fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
    console.log('🗑️ Deleted old file:', filePath);
  }
};

// ✅ Get file type from mimetype
export const getFileType = (mimetype) => {
  if (mimetype.startsWith('image/')) return 'image';
  if (mimetype === 'application/pdf') return 'pdf';
  return 'unknown';
};

// ✅ Validate if file exists
export const isFileExists = (filePath) => {
  return fs.existsSync(filePath);
};

export default upload;