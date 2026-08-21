import axios from "./axios";

export const getActiveIncidents = () => axios.get("/reports/active");
