import axios from 'axios';

const API_URL = import.meta.env.VITE_BACKEND_BASE_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,  // ✅ Cookie-based authentication
});

// Upload report and get AI analysis
export const analyzeReport = async (file) => {
  const formData = new FormData();
  formData.append('report', file);
  
  const response = await api.post('/ai/analyze', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  
  return response.data;
};

// Test Gemini API connection
export const testGemini = async () => {
  const response = await api.get('/ai/test');
  return response.data;
};

export default api;