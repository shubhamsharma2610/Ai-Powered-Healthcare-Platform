import axios from 'axios';

const API_URL = import.meta.env.VITE_BACKEND_BASE_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

export const getAllDoctors = async (filters = {}) => {
  const params = new URLSearchParams();
  if (filters.specialization) params.append('specialization', filters.specialization);
  if (filters.search) params.append('search', filters.search);
  
  const response = await api.get(`/doctors${params.toString() ? `?${params}` : ''}`);
  console.log('getAllDoctors raw response:', response.data);
  return response.data; // { success, data: { doctors, pagination } }
};

export const getDoctorById = async (id) => {
  const response = await api.get(`/doctors/${id}`);
  return response.data;
};

export const getSpecializations = async () => {
  const response = await api.get('/doctors/specializations');
  return response.data;
};

export default api;