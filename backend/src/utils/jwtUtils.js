import jwt from 'jsonwebtoken';
import cookies from 'cookie-parser';
export const generateToken = (userId, role, expiresIn = '7d') => {
  try {
    const token = jwt.sign(
      { userId, role },
      process.env.JWT_SECRET || 'your-secret-key-change-in-env',
      { expiresIn }
    );

    


    return token;
  } catch (error) {
    console.error('Token generation error:', error);
    return null;
  }
};

export const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key-change-in-env');
    return decoded;
  } catch (error) {
    console.error('Token verification error:', error.message);
    return null;
  }
};

export const decodeToken = (token) => {
  try {
    return jwt.decode(token);
  } catch (error) {
    return null;
  }
};
