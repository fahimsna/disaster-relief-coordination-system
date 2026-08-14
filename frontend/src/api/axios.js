import axios from "axios";

// central axios instance to stop repeating baseURL/headers everywhere
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000/api",
});

// grabs the token off localStorage on every request instead of threading it
// through props/context -- keeps VolunteerRegistration/VolunteerProfile simple
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
