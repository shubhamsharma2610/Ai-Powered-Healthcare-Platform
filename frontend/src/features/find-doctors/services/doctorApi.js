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
  // Response: { success, data: { doctors, pagination } }
  return response.data;
};

// ✅ FIX: Get single doctor by ID
export const getDoctorById = async (id) => {
  const response = await api.get(`/doctors/${id}`);
  console.log('Doctor API Response:', response.data);
  
  // ✅ Return the actual doctor object from response.data.data
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