import axios from 'axios';

const API_URL = import.meta.env.VITE_BACKEND_BASE_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,  // ✅ Cookie automatically bhejne ke liye - YAHI KAafi HAI
});

// ❌ Remove or simplify interceptor - Cookie already handles auth
api.interceptors.request.use(
  (config) => {
    // Debug log only - No token extraction needed
    console.log('📡 API Call:', {
      url: config.url,
      method: config.method,
      withCredentials: config.withCredentials
    });
    return config;
  },
  (error) => Promise.reject(error)
);

// Create appointment
export const createAppointment = async (bookingData) => {
  const response = await api.post('/appointments', bookingData);
  return response.data;
};

// Get user's appointments
export const getUserAppointments = async () => {
  const response = await api.get('/appointments/my-appointments');
  return response.data;
};

// Cancel appointment
export const cancelAppointment = async (appointmentId) => {
  const response = await api.put(`/appointments/${appointmentId}/cancel`);
  return response.data;
};

// Create Razorpay order
export const createPaymentOrder = async (amount, appointmentId) => {
  const response = await api.post('/payments/create-order', { amount, appointmentId });
  return response.data;
};

// Verify payment
export const verifyPayment = async (paymentData) => {
  const response = await api.post('/payments/verify', paymentData);
  return response.data;
};

export default api;