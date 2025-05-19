import axios from 'axios';
import keycloak from "../keycloak";

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8081/api';

// Lägg till Authorization-header i alla anrop
axios.interceptors.request.use(config => {
    const token = keycloak.token;
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

const api = {
    // User Management
    createUser: (userData) => axios.post(`${API_BASE_URL}/users`, userData),
    updateUsername: (userId, username) => axios.put(`${API_BASE_URL}/users/${userId}/username`, { username }),
    resetPassword: (userId, password) => axios.put(`${API_BASE_URL}/users/${userId}/reset-password`, {
        value: password,
        temporary: false,
        type: "password"
    }),
    getAllUsers: () => axios.get(`${API_BASE_URL}/users/all`),
    deleteUser: (userId) => axios.delete(`${API_BASE_URL}/users/${userId}`),

    // Categories
    getCategories: () => axios.get(`${API_BASE_URL}/categories`),
    addCategory: (category) => axios.post(`${API_BASE_URL}/categories`, category),
    updateCategory: (id, category) => axios.put(`${API_BASE_URL}/categories/${id}`, category),
    deleteCategory: (id) => axios.delete(`${API_BASE_URL}/categories/${id}`),
    reorderCategories: (categories) => axios.put(`${API_BASE_URL}/categories/reorder`, categories),

    // Products with pagination
    getProductsPaginated: (params) => {
        const queryParams = new URLSearchParams();
        if (params.page !== undefined) queryParams.append('page', params.page);
        if (params.size !== undefined) queryParams.append('size', params.size);
        if (params.search) queryParams.append('search', params.search);
        if (params.category) queryParams.append('categoryId', params.category); // changed here

        return axios.get(`${API_BASE_URL}/products/paginated/visible?${queryParams.toString()}`);
    },
    getAllProducts: () => axios.get(`${API_BASE_URL}/products`),
    addProduct: (product) => axios.post(`${API_BASE_URL}/products`, product),
    updateProduct: (id, product) => axios.put(`${API_BASE_URL}/products/${id}`, product),
    deleteProduct: (id) => axios.delete(`${API_BASE_URL}/products/${id}`),
    getVisibleProducts: () => axios.get(`${API_BASE_URL}/products/visible`),

    // Check if article number exists
    checkArticleNumber: (articleNumber) =>
        axios.get(`${API_BASE_URL}/products/check-article-number?articleNumber=${articleNumber}`),

    // Orders
    getAllOrders: () => axios.get(`${API_BASE_URL}/orders/all`),
    getMyOrders: () => axios.get(`${API_BASE_URL}/orders/my`),

    getOrderById: (id) => axios.get(`${API_BASE_URL}/orders/order/${id}`),
    createOrder: (order) => {
        return axios.post(`${API_BASE_URL}/orders`, order);
    },
    updateOrder: (id, order) => axios.put(`${API_BASE_URL}/orders/${id}`, order),
    deleteOrder: (id) => axios.delete(`${API_BASE_URL}/orders/${id}`),
    updateOrderStatus: (id, markAsSent) => axios.put(`${API_BASE_URL}/orders/${id}/status`, null, {
        params: { markAsSent }
    }),

    // Order Items
    getOrderItems: (orderId) => axios.get(`${API_BASE_URL}/orderitems?orderId=${orderId}`),
    addOrderItem: (item) => axios.post(`${API_BASE_URL}/orderitems`, item),
    updateOrderItem: (id, item) => axios.put(`${API_BASE_URL}/orderitems/${id}`, item),
    deleteOrderItem: (id) => axios.delete(`${API_BASE_URL}/orderitems/${id}`)
};

export default api;
