import axios from "./axios";

export const getMyMission = () => axios.get("/stage-updates/mine");

export const submitStageUpdate = (note, photoUrl) =>
  axios.post("/stage-updates", { note, photoUrl }, { responseType: "blob" });

export const getStageFeed = () => axios.get("/stage-updates/feed");
