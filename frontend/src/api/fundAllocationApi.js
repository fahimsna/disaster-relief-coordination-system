import api from "./axios";

// Get overall fund allocation transparency dashboard
export const getFundAllocationDashboard = () =>
  api.get("/fund-allocations/dashboard");

// Get all fund allocations
export const getFundAllocations = () => api.get("/fund-allocations");

// Get allocations for a specific campaign
export const getCampaignAllocations = (campaignId) =>
  api.get(`/fund-allocations/campaign/${campaignId}`);

// Create a fund allocation
export const createFundAllocation = (data) =>
  api.post("/fund-allocations", data);

// Update a fund allocation
export const updateFundAllocation = (id, data) =>
  api.put(`/fund-allocations/${id}`, data);

// Delete a fund allocation
export const deleteFundAllocation = (id) =>
  api.delete(`/fund-allocations/${id}`);
