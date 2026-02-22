import api from "./axios";

export const getCart = () => api.get("/cart");

export const addToCartApi = (data) => api.post("/cart", data);

export const updateCartItem = (id, data) =>
    api.put(`/cart/${id}`, data);

export const removeCartItem = (id) =>
    api.delete(`/cart/${id}`);
