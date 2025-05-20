import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import keycloak from "../keycloak";

/**
 * Custom React hook for managing active and completed orders in the application.
 * Handles loading, sorting, pagination, bulk actions (mark as sent, return, delete), and navigation to create a new order.
 *
 * @returns {Object} Object containing order data, state, and utility functions:
 *   - orders, completedOrders: Lists of active and completed orders
 *   - loading: Boolean flag indicating if orders are being loaded
 *   - editingOrder, setEditingOrder: Currently edited order and its setter
 *   - selectedActive, setSelectedActive: Selected active order IDs and setter
 *   - selectedCompleted, setSelectedCompleted: Selected completed order IDs and setter
 *   - activeVisibleRows, setActiveVisibleRows: Number of visible rows for active orders and its setter
 *   - completedVisibleRows, setCompletedVisibleRows: Number of visible rows for completed orders and its setter
 *   - activeSortConfig, completedSortConfig: Current sorting configurations for both tables
 *   - recentlyReturnedOrderIds: IDs of orders recently moved back to active
 *   - sortOrders: Function to sort an order list by given field and direction
 *   - fetchOrders: Fetches all orders from backend
 *   - handleSort: Handles sorting logic for both active and completed orders
 *   - markSent: Marks selected active orders as completed
 *   - returnToActive: Moves selected completed orders back to active
 *   - deleteOrders: Deletes a list of orders by ID and type
 *   - handleNewOrder: Creates a new order and navigates to its product view
 */

const sanitize = s =>
    s.trim()
        .normalize('NFD')
        .replace(/[^\x00-\x7F]/g, '')
        .replace(/[^a-zA-Z0-9]+/g, '_')
        .replace(/^_|_$/g, '')
        .toLowerCase();

export const useOrdersManagement = () => {
    const navigate = useNavigate();

    const [orders, setOrders] = useState([]);
    const [completedOrders, setCompletedOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingOrder, setEditingOrder] = useState(null);
    const [selectedActive, setSelectedActive] = useState([]);
    const [selectedCompleted, setSelectedCompleted] = useState([]);
    const [recentlyReturnedOrderIds, setRecentlyReturnedOrderIds] = useState([]);
    const [activeVisibleRows, setActiveVisibleRows] = useState(5);
    const [completedVisibleRows, setCompletedVisibleRows] = useState(5);
    const [activeSortConfig, setActiveSortConfig] = useState({ field: 'creationDate', direction: 'desc' });
    const [completedSortConfig, setCompletedSortConfig] = useState({ field: 'sendDate', direction: 'desc' });
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        setIsAdmin(keycloak.hasRealmRole('admin'));
    }, [isAdmin]);

    const fetchOrders = async () => {
        try {
            const isReallyAdmin = keycloak.hasRealmRole('admin');
            console.log("Fetching orders as admin:", isReallyAdmin);
            let res;
            if (isReallyAdmin) {
                res = await api.getAllOrders();
            } else {
                res = await api.getMyOrders();
            }
            setOrders(res.data.filter(o => !o.completed));
            setCompletedOrders(res.data.filter(o => o.completed));
        } catch (err) {
            console.error('Error fetching orders:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const sortOrders = (list, { field, direction }) => {
        if (!field) return list;

        return [...list].sort((a, b) => {
            const aVal = a[field];
            const bVal = b[field];

            if (field === 'sendDate') {
                if (!aVal && !bVal) return 0;
                if (!aVal) return 1;
                if (!bVal) return -1;
            }

            if (field.toLowerCase().includes('date')) {
                const aDate = aVal ? new Date(aVal) : new Date(0);
                const bDate = bVal ? new Date(bVal) : new Date(0);
                return direction === 'asc' ? aDate - bDate : bDate - aDate;
            }

            const cmp = String(aVal).localeCompare(String(bVal));
            return direction === 'asc' ? cmp : -cmp;
        });
    };

    const handleSort = (type, field, direction) => {
        const isActive = type === 'active';
        const current = isActive ? activeSortConfig : completedSortConfig;
        const newDir = current.field === field ? direction || (current.direction === 'asc' ? 'desc' : 'asc') : direction || 'asc';
        const update = { field, direction: newDir };

        isActive ? setActiveSortConfig(update) : setCompletedSortConfig(update);
    };

    const markSent = async () => {
        await Promise.all(selectedActive.map(id => api.updateOrderStatus(id, true)));
        setSelectedActive([]);
        fetchOrders();
    };

    const returnToActive = async () => {
        await Promise.all(selectedCompleted.map(id => api.updateOrderStatus(id, false)));
        setRecentlyReturnedOrderIds(selectedCompleted);
        setSelectedCompleted([]);
        fetchOrders();

        setTimeout(() => {
            setRecentlyReturnedOrderIds([]);
        }, 10000);
    };

    const deleteOrders = async (ids, type) => {
        try {
            for (const id of ids) {
                await api.deleteOrder(id);
            }

            if (type === 'active') setSelectedActive([]);
            else setSelectedCompleted([]);
            fetchOrders();
        } catch (error) {
            console.error("Failed to delete orders:", error);
            alert("Some orders could not be deleted. Please try again.");
        }
    };

    const downloadOrderPdf = async (order) => {
        try {
            const res = await api.downloadOrderPdf(order.id);
            const header = res.headers['content-disposition'] || '';
            let fileName = (header.match(/filename=\"?([^\";]+)\"?/) || [])[1];

            if (!fileName) {
                const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
                fileName = `order_${sanitize(order.customerName)}_${today}.pdf`;
            }

            const blob = new Blob([res.data], { type: 'application/pdf' });
            const url  = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = fileName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            } catch (err) {
                alert('Failed to download PDF.');
                console.error(err);
            }
        };

    const handleNewOrder = async () => {
        try {
            const userId = keycloak.subject;
            const orderData = {
                customerName: "New Customer",
                sendDate: null,
                completed: false
            };

            // Använd keycloak för att hämta användar-ID


            const response = await api.createOrder(orderData, userId);
            if (response.data && response.data.id) {
                navigate(`/orders/${response.data.id}/products`);
            } else {
                throw new Error('Invalid response from server');
            }
        } catch (err) {
            console.error('Error creating order:', err);
            alert('Failed to create order. Please try again.');
        }
    };

    return {
        orders,
        completedOrders,
        loading,
        editingOrder,
        setEditingOrder,
        selectedActive,
        setSelectedActive,
        selectedCompleted,
        setSelectedCompleted,
        activeVisibleRows,
        setActiveVisibleRows,
        completedVisibleRows,
        setCompletedVisibleRows,
        activeSortConfig,
        completedSortConfig,
        recentlyReturnedOrderIds,
        sortOrders,
        fetchOrders,
        handleSort,
        markSent,
        returnToActive,
        deleteOrders,
        downloadOrderPdf,
        handleNewOrder,
        isAdmin
    };
};
