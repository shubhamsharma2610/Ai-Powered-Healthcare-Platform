import axios from 'axios';

const API_URL = import.meta.env.VITE_BACKEND_BASE_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

// ============ DOCTOR PROFILE ============
export const getDoctorProfile = async () => {
  const response = await api.get('/doctors/profile');
  return response.data;
};

// ✅ ADD THIS - Update doctor profile
export const updateDoctorProfile = async (profileData) => {
  const response = await api.put('/doctors/profile', profileData);
  return response.data;
};

// ============ DOCTOR STATS ============
export const getDoctorStats = async () => {
  const response = await api.get('/doctors/stats');
  return response.data;
};

// ============ DOCTOR APPOINTMENTS ============
export const getDoctorAppointments = async (params = {}) => {
  const response = await api.get('/doctors/appointments', { params });
  return response.data;
};

export const updateAppointmentStatus = async (id, status) => {
  const response = await api.put(`/doctors/appointments/${id}/status`, { status });
  return response.data;
};

// ============ DOCTOR PATIENTS ============
export const getDoctorPatients = async (params = {}) => {
  const response = await api.get('/doctors/patients', { params });
  return response.data;
};

// ============ DOCTOR SCHEDULE ============
export const getDoctorSchedule = async () => {
  const response = await api.get('/doctors/schedule');
  return response.data;
};

export const updateDoctorSchedule = async (availability) => {
  const response = await api.put('/doctors/schedule', { availability });
  return response.data;
};

export default api;