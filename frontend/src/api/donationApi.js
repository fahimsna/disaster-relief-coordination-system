import api from "./axios";

export const createCheckoutSession = (data, token) => {
  return api.post("/donations/checkout", data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getMyDonations = (token) => {
  return api.get("/donations/my", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getDonationReceipt = (sessionId, token) => {
  return api.get(`/donations/receipt/${sessionId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const cancelDonation = (sessionId, token) => {
  return api.put(
    `/donations/cancel/${sessionId}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
};

export default api;
