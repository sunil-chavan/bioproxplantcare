import api from "./axios";

export const getSliders = () => api.get("/sliders");
