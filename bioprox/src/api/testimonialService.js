import axios from "./axios";

export const getTestimonials = () => axios.get("/testimonials");
