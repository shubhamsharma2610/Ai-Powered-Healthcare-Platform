import axios from 'axios';

const API_URL = import.meta.env.VITE_BACKEND_BASE_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

// Get patient profile
export const getPatientProfile = async () => {
  const response = await api.get('/patients/profile');
  return response.data;
};

// Update patient profile - ✅ Make sure this exists
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