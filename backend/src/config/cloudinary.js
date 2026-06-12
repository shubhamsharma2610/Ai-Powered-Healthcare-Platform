import { v2 as cloudinary } from 'cloudinary';

// Optional: Explicit config (automatic bhi ho jata hai without this)
if (process.env.CLOUDINARY_URL) {
  cloudinary.config({
    url: process.env.CLOUDINARY_URL
  });
}

export default cloudinary;