import axios from 'axios';

const API_URL = import.meta.env.VITE_BACKEND_BASE_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

// Get all doctors
export const getAllDoctors = async (filters = {}) => {
  const params = new URLSearchParams();
  if (filters.specialization) params.append('specialization', filters.specialization);
  if (filters.search) params.append('search', filters.search);
  
  const response = await api.get(`/doctors${params.toString() ? `?${params}` : ''}`);
  return response.data;
};

// ✅ Get single doctor by ID for public viewing (patients)
export const getDoctorById = async (id) => {
  const response = await api.get(`/doctors/public/${id}`);
  console.log('Public Doctor API Response:', response.data);
  
  if (response.data.success && response.data.data) {
    return response.data.data;
  }
  return response.data;
};

// Get specializations
export const getSpecializations = async () => {
  const response = await api.get('/doctors/specializations');
  return response.data;
};

export default api;