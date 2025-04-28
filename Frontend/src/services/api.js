// services/api.js
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

const api = {
    // Categories
    getCategories: () => axios.get(`${API_BASE_URL}/categories`),

    // Products with pagination
    getProductsPaginated: (params) => {
        const queryParams = new URLSearchParams();
        if (params.page !== undefined) queryParams.append('page', params.page);
        if (params.size !== undefined) queryParams.append('size', params.size);
        if (params.search) queryParams.append('search', params.search);
        if (params.category) queryParams.append('categoryId', params.category);

        return axios.get(`${API_BASE_URL}/products/paginated?${queryParams.toString()}`);
    },

    // Orders
    getOrders: () => axios.get(`${API_BASE_URL}/orders`),
    getOrderById: (id) => axios.get(`${API_BASE_URL}/orders/order/${id}`),
    createOrder: (order) => axios.post(`${API_BASE_URL}/orders`, order),
    updateOrder: (id, order) => axios.put(`${API_BASE_URL}/orders/${id}`, order),
    deleteOrder: (id) => axios.delete(`${API_BASE_URL}/orders/${id}`),
    updateOrderStatus: (id, markAsSent) => axios.put(`${API_BASE_URL}/orders/${id}/status`, null, {
        params: { markAsSent }
    }),

    // Order Items
    getOrderItems: (orderId) => axios.get(`${API_BASE_URL}/orderitems?orderId=${orderId}`),
    addOrderItem: (item) => axios.post(`${API_BASE_URL}/orderitems`, item),
    updateOrderItem: (id, item) => axios.put(`${API_BASE_URL}/orderitems/${id}`, item),
    deleteOrderItem: (id) => axios.delete(`${API_BASE_URL}/orderitems/${id}`),
};

export default api;
