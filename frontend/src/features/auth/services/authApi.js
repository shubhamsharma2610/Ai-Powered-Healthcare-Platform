import axios from "axios";

const API = axios.create({
  baseURL: `${import.meta.env.VITE_BACKEND_BASE_URL}/api/auth`,
});

// Register API
export const registerUser = async (userData) => {
  const response = await API.post("/register", userData);
  return response.data;
};

// Login API
export const loginUser = async (userData) => {
  const response = await API.post("/login", userData);
  return response.data;
};