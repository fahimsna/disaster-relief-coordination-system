import axios from "axios";

// API base URL: read from .env for production, fallback to local dev server.
// Set VITE_API_URL in your .env file (or in the deployment settings) if needed.
const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://disaster-relief-coordination-system-five.vercel.app/api/auth";

const api = axios.create({ baseURL: API_URL });

export const registerRequest = (data) => api.post("/register", data);
export const loginRequest = (data) => api.post("/login", data);
export const logoutRequest = () => api.post("/logout");

export default api;
