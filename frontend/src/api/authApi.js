import axios from "axios";

// Base API URL.
// Keep VITE_API_URL as:
// https://disaster-relief-coordination-system-0z00.onrender.com/api
//
// Auth routes are under /api/auth.
const API_URL =
  import.meta.env.VITE_API_URL ||
  "https://disaster-relief-coordination-system-0z00.onrender.com/api";

const api = axios.create({
  baseURL: `${API_URL}/auth`,
});

// Register
export const registerRequest = (data) => api.post("/register", data);

// Login
export const loginRequest = (data) => api.post("/login", data);

// Logout
export const logoutRequest = () => api.post("/logout");

export default api;
