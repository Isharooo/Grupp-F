import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export const useOrdersManagement = () => {
    const navigate = useNavigate();

    // State
    const [orders, setOrders] = useState([]);
    const [completedOrders, setCompletedOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showOrderForm, setShowOrderForm] = useState(false);
    const [editingOrder, setEditingOrder] = useState(null);
    const [selectedActive, setSelectedActive] = useState([]);
    const [selectedCompleted, setSelectedCompleted] = useState([]);
    const [recentlyReturnedOrderIds, setRecentlyReturnedOrderIds] = useState([]);

    // Pagination
    const [activeVisibleRows, setActiveVisibleRows] = useState(5);
    const [completedVisibleRows, setCompletedVisibleRows] = useState(5);

    // Sorting
    const [activeSortConfig, setActiveSortConfig] = useState({ field: 'creationDate', direction: 'desc' });
    const [completedSortConfig, setCompletedSortConfig] = useState({ field: 'sendDate', direction: 'desc' });

    const fetchOrders = async () => {
        try {
            const res = await api.getOrders();
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

    // Bulk actions
    const markSent = async () => {
        await Promise.all(selectedActive.map(id => api.updateOrderStatus(id, true)));
        setSelectedActive([]);
        fetchOrders();
    };

    const returnToActive = async () => {
        await Promise.all(selectedCompleted.map(id => api.updateOrderStatus(id, false)));
        setRecentlyReturnedOrderIds(selectedCompleted); // Spara ID:n för ordrar som återaktiveras
        setSelectedCompleted([]);
        fetchOrders();

        // Rensa markeringen efter 10 sekunder
        setTimeout(() => {
            setRecentlyReturnedOrderIds([]);
        }, 10000);
    };

    const deleteOrders = async (ids, type) => {
        try {
            // Ta bort en order i taget (sekventiellt)
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


    const handleNewOrder = async () => {
        try {
            const orderData = {
                customerName: "New Customer",
                sendDate: null,
                completed: false
            };

            const response = await api.createOrder(orderData);
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
        showOrderForm,
        setShowOrderForm,
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
        sortOrders, // <-- LÄGG TILL DENNA
        fetchOrders,
        handleSort,
        markSent,
        returnToActive,
        deleteOrders,
        handleNewOrder
    };
};
