import api from "./axios";

export const loginUser = (data) => api.post("/login", data);

export const registerUser = (data) => api.post("/register", data);

export const logoutUser = () => api.post("/logout");

export const getUser = () => api.get("/user");
