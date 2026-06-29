import API from "./api.js";

export const getMoodToday = async () => (await API.get("/moods/today")).data;
export const getMoods = async () => (await API.get("/moods")).data;
export const createMood = async (data) => (await API.post("/moods", data)).data;
export const deleteMood = async (id) => (await API.delete(`/moods/${id}`)).data;
