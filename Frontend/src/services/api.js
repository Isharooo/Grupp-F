// src/services/api.js
import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8080/api', // Spring Boots standardport
});

export default {
    // Orders
    getOrders: () => api.get('/orders'),
    updateOrder: (id, order) => api.put(`/orders/${id}`, order),
    deleteOrder: (id) => api.delete(`/orders/${id}`),
    createOrder: (order) => api.post('/orders', order),
    changeCompleteStatus: (id) => api.put(`/orders/${id}/changeCompleteStatus`),
    updateOrderStatus: (id, markAsSent) => api.put(`/orders/${id}/status`, null, {params: { markAsSent },}),


    // Products
    getProducts: () => api.get('/products'),
    getProductById: (id) => api.get(`/products/${id}`),
};