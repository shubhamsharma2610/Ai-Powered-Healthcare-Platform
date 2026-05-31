import axios from "axios";
import Cookies from 'js-cookie';

const API = axios.create({
  baseURL: `${import.meta.env.VITE_BACKEND_BASE_URL}/auth`,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true  // 👈 IMPORTANT - Send cookies with requests
});

// Register API
export const registerUser = async (userData) => {
  const response = await API.post("/register", userData);
  
  // Save token from cookie (if backend sets it)
  const token = Cookies.get('token');
  if (token) {
    // You might not need to store token separately if using HTTP-only cookies
    console.log('Token set in cookie');
  }
  
  return response.data;
};

// Login API
export const loginUser = async (userData) => {
  const response = await API.post("/login", userData);
  
  // Backend will set cookie automatically
  // No need to manually save token
  
  return response.data;
};

// Logout API
export const logoutUser = async () => {
  const response = await API.post("/logout");
  
  // Clear cookie
  Cookies.remove('token');
  Cookies.remove('myToken');
  
  return response.data;
};

// Get current user
export const getCurrentUser = async () => {
  const response = await API.get("/current-user");
  return response.data;
};

export default API;