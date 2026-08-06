import axios from "axios";

const API_URL =
  import.meta.env.VITE_DONATION_API_URL ||
  "http://localhost:8000/api/donations";

const api = axios.create({
  baseURL: API_URL,
});

export const createCheckoutSession = (data, token) =>
  api.post("/checkout", data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

export const getMyDonations = (token) =>
  api.get("/my", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

export default api;
