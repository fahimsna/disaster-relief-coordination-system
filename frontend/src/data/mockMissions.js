// Mission History is still mock -- there's no Mission model/API yet, this
// just gives the profile panel something real to render. Will swap for a GET
// call once the missions feature exists on the backend.
export const mockMissions = [
  { id: 1, title: "Sylhet Flood", status: "Completed", date: "2026-05-15" },
  {
    id: 2,
    title: "Cox's Bazar Cyclone",
    status: "In Progress",
    date: "2026-06-12",
  },
  { id: 3, title: "Dhaka Earthquake", status: "Completed", date: "2026-03-03" },
];
