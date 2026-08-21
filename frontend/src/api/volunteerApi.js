import axios from "./axios";

export const getVolunteerBoard = () => axios.get("/volunteers/board");

export const assignVolunteerToIncident = (volunteerId, incidentId) =>
  axios.patch(`/volunteers/${volunteerId}/assign`, { incidentId });

export const markVolunteerDeployed = (volunteerId) =>
  axios.patch(`/volunteers/${volunteerId}/deploy`);

export const unassignVolunteer = (volunteerId) =>
  axios.patch(`/volunteers/${volunteerId}/unassign`);
