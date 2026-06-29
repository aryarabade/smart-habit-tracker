import API from "./api.js";

export const getHabits     = async ()         => (await API.get("/habits")).data;
export const createHabit   = async (data)     => (await API.post("/habits", data)).data;
export const completeHabit = async (id)       => (await API.put(`/habits/${id}/complete`)).data;
export const deleteHabit   = async (id)       => (await API.delete(`/habits/${id}`)).data;
export const updateHabit   = async (id, data) => (await API.put(`/habits/${id}`, data)).data;