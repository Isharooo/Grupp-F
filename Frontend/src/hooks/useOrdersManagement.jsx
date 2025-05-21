import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../services/api';
import keycloak from "../keycloak";

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
            toast.error("Unable to load order data");
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
        const selectedOrders = orders.filter(order =>
            selectedActive.includes(order.id)
        );

        const hasPending = selectedOrders.some(order => !order.sendDate);

        if (hasPending) {
            toast.error("Cannot mark as sent - missing ship date", {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
            return;
        }

        try {
            await Promise.all(selectedActive.map(id =>
                api.updateOrderStatus(id, true)
            ));
            setSelectedActive([]);
            fetchOrders();
            toast.success("Orders marked as sent successfully");
        } catch (err) {
            console.error('Error marking orders as sent:', err);
            toast.error("Could not mark orders as sent");
        }
    };

    const returnToActive = async () => {
        try {
            await Promise.all(selectedCompleted.map(id =>
                api.updateOrderStatus(id, false)
            ));
            setRecentlyReturnedOrderIds(selectedCompleted);
            setSelectedCompleted([]);
            fetchOrders();
            toast.success("Orders returned to active status");
            setTimeout(() => {
                setRecentlyReturnedOrderIds([]);
            }, 10000);
        } catch (err) {
            console.error('Error returning orders:', err);
            toast.error("Could not restore orders");
        }
    };

    const deleteOrders = async (ids, type) => {
        try {
            for (const id of ids) {
                await api.deleteOrder(id);
            }
            if (type === 'active') setSelectedActive([]);
            else setSelectedCompleted([]);
            fetchOrders();
            toast.success("Orders deleted successfully");
        } catch (error) {
            console.error("Failed to delete orders:", error);
            toast.error("Could not delete orders");
        }
    };

    const downloadOrderPdf = async (order) => {
        try {
            const res = await api.downloadOrderPdf(order.id);
            const header = res.headers['content-disposition'] || '';
            let fileName = (header.match(/filename=\"?([^\";]+)\"?/) || [])[1];

            if (!fileName) {
                const today = new Date().toISOString().slice(0, 10);
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
            toast.success("PDF downloaded successfully");
        } catch (err) {
            console.error('Error downloading PDF:', err);
            toast.error("Could not download PDF");
        }
    };

    const handleNewOrder = async () => {
        try {
            const userId = keycloak.subject;
            const response = await api.createOrder({
                customerName: "New Customer",
                sendDate: null,
                completed: false
            }, userId);

            if (response.data?.id) {
                navigate(`/orders/${response.data.id}/products`);
                toast.success("New order created successfully");
            }
        } catch (err) {
            console.error('Error creating order:', err);
            toast.error("Could not create new order");
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
