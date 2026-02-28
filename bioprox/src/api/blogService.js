import axios from "./axios";

export const getBlogs = () => axios.get("/blogs");
export const getBlogById = (id) => axios.get(`/blogs/${id}`);
