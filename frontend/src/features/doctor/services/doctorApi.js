import axios from 'axios';

const API_URL = import.meta.env.VITE_BACKEND_BASE_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ============ API FUNCTIONS ============
export const getDoctorProfile = async () => {
  const response = await api.get('/doctors/profile');
  return response.data;
};

export const updateDoctorProfile = async (profileData) => {
  const response = await api.put('/doctors/profile', profileData);
  return response.data;
};

export const getDoctorStats = async () => {
  const response = await api.get('/doctors/stats');
  return response.data;
};

export const getDoctorAppointments = async (params = {}) => {
  const response = await api.get('/doctors/appointments', { params });
  return response.data;
};

export const updateAppointmentStatus = async (id, status) => {
  const response = await api.put(`/doctors/appointments/${id}/status`, { status });
  return response.data;
};

export const getDoctorPatients = async (params = {}) => {
  const response = await api.get('/doctors/patients', { params });
  return response.data;
};

export const getDoctorSchedule = async () => {
  const response = await api.get('/doctors/schedule');
  return response.data;
};

export const updateDoctorSchedule = async (availability) => {
  const response = await api.put('/doctors/schedule', { availability });
  return response.data;
};

export const submitForApproval = async () => {
  const response = await api.post('/doctors/submit-approval');
  return response.data;
};

export default api;