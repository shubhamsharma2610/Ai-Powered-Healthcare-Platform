import axios from 'axios';

const API_URL = import.meta.env.VITE_BACKEND_BASE_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,  // ✅ This will send cookies automatically
});

// ✅ Optional: Add debug interceptor to see if cookie is sent
api.interceptors.request.use(
  (config) => {
    console.log('📡 Request:', config.method.toUpperCase(), config.url);
    console.log('🍪 Cookies will be sent automatically (withCredentials: true)');
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Handle 401 responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.error('❌ Unauthorized - Please login again');
      // Don't remove token because it's in cookie
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Get patient profile
export const getPatientProfile = async () => {
  const response = await api.get('/patients/profile');
  return response.data;
};

// Update patient profile
export const updatePatientProfile = async (data) => {
  const response = await api.put('/patients/profile', data);
  return response.data;
};

// Get patient appointments
export const getPatientAppointments = async () => {
  const response = await api.get('/appointments/my-appointments');
  return response.data;
};

// Get transaction history
export const getTransactionHistory = async () => {
  const response = await api.get('/patients/transactions');
  return response.data;
};

export default api;