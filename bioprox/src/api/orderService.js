import api from "./axios";

export const getOrders = () => api.get("/orders");

export const getOrderById = (id) =>
    api.get(`/orders/${id}`);

export const createOrder = (data) =>
    api.post("/orders", data);

export const cancelOrder = (id) =>
    api.post(`/orders/${id}/cancel`);

export const verifyPayment = (data) =>
    api.post("/orders/verify-payment", data);
