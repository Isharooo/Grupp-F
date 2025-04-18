import React, { useState, useEffect } from 'react';
import {
    FaTrash,
    FaEdit,
    FaTruck,
    FaUndo,
    FaPrint,
    FaFileDownload,
    FaSortUp,
    FaSortDown
} from 'react-icons/fa';
import { Link } from 'react-router-dom';

import Header from '../common/Header';
import MyButton from '../common/Button';
import OrderForm from '../forms/OrderForm';
import EditOrderForm from '../forms/EditOrderForm';
import api from '../../services/api';

const OrdersPage = () => {
    // State
    const [orders, setOrders] = useState([]);
    const [completedOrders, setCompletedOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showOrderForm, setShowOrderForm] = useState(false);
    const [editingOrder, setEditingOrder] = useState(null);
    const [selectedActive, setSelectedActive] = useState([]);
    const [selectedCompleted, setSelectedCompleted] = useState([]);

    // Pagination
    const [activeVisibleRows, setActiveVisibleRows] = useState(5);
    const [completedVisibleRows, setCompletedVisibleRows] = useState(5);

    // Sorting
    const [activeSortConfig, setActiveSortConfig] = useState({
        field: 'creationDate',
        direction: 'desc'
    });
    const [completedSortConfig, setCompletedSortConfig] = useState({
        field: 'sendDate',
        direction: 'desc'
    });

    // Fetch on mount
    useEffect(() => {
        fetchOrders();
    }, []);

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

    // Generic sorter
    const sortOrders = (list, { field, direction }) => {
        if (!field) return list;
        return [...list].sort((a, b) => {
            const aVal = a[field];
            const bVal = b[field];

            // sendDate pending → bottom
            if (field === 'sendDate') {
                if (!aVal && !bVal) return 0;
                if (!aVal) return 1;
                if (!bVal) return -1;
            }

            // Date comparison
            if (field.toLowerCase().includes('date')) {
                const aDate = aVal ? new Date(aVal) : new Date(0);
                const bDate = bVal ? new Date(bVal) : new Date(0);
                return direction === 'asc'
                    ? aDate - bDate
                    : bDate - aDate;
            }

            const cmp = String(aVal).localeCompare(String(bVal));
            return direction === 'asc' ? cmp : -cmp;
        });
    };

    // Master sort handler
    const handleSort = (type, field, direction) => {
        const isActive = type === 'active';
        const current = isActive ? activeSortConfig : completedSortConfig;
        const newDir =
            current.field === field
                ? direction
                : direction || 'asc';
        const update = { field, direction: newDir };
        isActive
            ? setActiveSortConfig(update)
            : setCompletedSortConfig(update);
    };

    // Toggle when clicking header
    const handleHeaderSort = (type, field) => {
        const current = type === 'active' ? activeSortConfig : completedSortConfig;
        const nextDir =
            current.field === field && current.direction === 'asc'
                ? 'desc'
                : 'asc';
        handleSort(type, field, nextDir);
    };

    // Sort icons
    const getSortIcon = (type, field, config) => (
        <span className="ml-1 inline-flex flex-col gap-0.5">
      <FaSortUp
          className={`cursor-pointer ${
              config.field === field && config.direction === 'asc'
                  ? 'text-blue-600'
                  : 'text-gray-300'
          }`}
          onClick={e => {
              e.stopPropagation();
              handleSort(type, field, 'asc');
          }}
      />
      <FaSortDown
          className={`cursor-pointer ${
              config.field === field && config.direction === 'desc'
                  ? 'text-blue-600'
                  : 'text-gray-300'
          }`}
          onClick={e => {
              e.stopPropagation();
              handleSort(type, field, 'desc');
          }}
      />
    </span>
    );

    // Selections
    const toggleSelect = (id, checked, type) => {
        const setter = type === 'active' ? setSelectedActive : setSelectedCompleted;
        const prev = type === 'active' ? selectedActive : selectedCompleted;
        setter(
            checked ? [...prev, id] : prev.filter(x => x !== id)
        );
    };

    // Bulk actions
    const markSent = async () => {
        await Promise.all(selectedActive.map(id => api.updateOrderStatus(id, true)));
        setSelectedActive([]);
        fetchOrders();
    };
    const returnToActive = async () => {
        await Promise.all(selectedCompleted.map(id => api.updateOrderStatus(id, false)));
        setSelectedCompleted([]);
        fetchOrders();
    };
    const deleteOrders = async (ids, type) => {
        await Promise.all(ids.map(id => api.deleteOrder(id)));
        if (type === 'active') setSelectedActive([]);
        else setSelectedCompleted([]);
        fetchOrders();
    };

    if (loading) {
        return <div className="text-center mt-8">Loading orders…</div>;
    }

    const visibleActive = sortOrders(orders, activeSortConfig).slice(0, activeVisibleRows);
    const visibleCompleted = sortOrders(completedOrders, completedSortConfig).slice(0, completedVisibleRows);

    return (
        <div className="flex flex-col min-h-screen bg-white">
            <Header />

            <main className="flex-grow">
                {/* Active Orders */}
                <section className="max-w-6xl mx-auto mt-8 px-4">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-bold">Active Orders</h2>
                        <div className="flex gap-2">
                            <button
                                onClick={markSent}
                                disabled={!selectedActive.length}
                                className="bg-blue-600 text-white px-3 py-1 rounded flex items-center gap-1"
                            >
                                <FaTruck /> Mark Sent
                            </button>
                            <button
                                onClick={() => deleteOrders(selectedActive, 'active')}
                                disabled={!selectedActive.length}
                                className="bg-red-600 text-white px-3 py-1 rounded flex items-center gap-1"
                            >
                                <FaTrash /> Delete
                            </button>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                            <thead>
                            <tr className="border-b-2 border-orange-300">
                                <th className="p-2 w-8"></th>
                                {[
                                    { label: 'Customer', field: 'customerName' },
                                    { label: 'Created', field: 'creationDate' },
                                    { label: 'Send Date', field: 'sendDate' }
                                ].map(col => (
                                    <th
                                        key={col.field}
                                        className="p-2 text-left cursor-pointer"
                                        onClick={() => handleHeaderSort('active', col.field)}
                                    >
                                        <div className="flex items-center gap-1">
                                            {col.label}
                                            {getSortIcon('active', col.field, activeSortConfig)}
                                        </div>
                                    </th>
                                ))}
                                <th className="p-2 text-left">Actions</th>
                            </tr>
                            </thead>

                            <tbody>
                            {visibleActive.map(order => (
                                <tr
                                    key={order.id}
                                    className="border-b border-orange-200 hover:bg-gray-50"
                                >
                                    <td className="p-2">
                                        <input
                                            type="checkbox"
                                            checked={selectedActive.includes(order.id)}
                                            onChange={e =>
                                                toggleSelect(order.id, e.target.checked, 'active')
                                            }
                                        />
                                    </td>
                                    <td className="p-2">{order.customerName}</td>
                                    <td className="p-2">
                                        {new Date(order.creationDate).toLocaleDateString()}
                                    </td>
                                    <td className="p-2">
                                        {order.sendDate
                                            ? new Date(order.sendDate).toLocaleDateString()
                                            : 'Pending'}
                                    </td>
                                    <td className="p-2 flex gap-2">
                                        <button
                                            onClick={() => setEditingOrder(order)}
                                            title="Edit"
                                            className="text-blue-600 hover:text-blue-800"
                                        >
                                            <FaEdit />
                                        </button>
                                        <button title="Print" className="text-green-600 hover:text-green-800">
                                            <FaPrint />
                                        </button>
                                        <button
                                            title="Download"
                                            className="text-purple-600 hover:text-purple-800"
                                        >
                                            <FaFileDownload />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>

                    {orders.length > activeVisibleRows && (
                        <div className="mt-4 flex justify-center">
                            <button
                                onClick={() => setActiveVisibleRows(prev => prev + 5)}
                                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                            >
                                Load More
                            </button>
                        </div>
                    )}
                </section>

                {/* Completed Orders */}
                <section className="max-w-6xl mx-auto mt-8 px-4">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-bold">Completed Orders</h2>
                        <div className="flex gap-2">
                            <button
                                onClick={returnToActive}
                                disabled={!selectedCompleted.length}
                                className="bg-green-600 text-white px-3 py-1 rounded flex items-center gap-1"
                            >
                                <FaUndo /> Return
                            </button>
                            <button
                                onClick={() => deleteOrders(selectedCompleted, 'completed')}
                                disabled={!selectedCompleted.length}
                                className="bg-red-600 text-white px-3 py-1 rounded flex items-center gap-1"
                            >
                                <FaTrash /> Delete
                            </button>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                            <thead>
                            <tr className="border-b-2 border-orange-300">
                                <th className="p-2 w-8"></th>
                                {[
                                    { label: 'Customer', field: 'customerName' },
                                    { label: 'Created', field: 'creationDate' },
                                    { label: 'Sent', field: 'sendDate' }
                                ].map(col => (
                                    <th
                                        key={col.field}
                                        className="p-2 text-left cursor-pointer"
                                        onClick={() => handleHeaderSort('completed', col.field)}
                                    >
                                        <div className="flex items-center gap-1">
                                            {col.label}
                                            {getSortIcon('completed', col.field, completedSortConfig)}
                                        </div>
                                    </th>
                                ))}
                            </tr>
                            </thead>

                            <tbody>
                            {visibleCompleted.map(order => (
                                <tr
                                    key={order.id}
                                    className="border-b border-orange-200 hover:bg-gray-50"
                                >
                                    <td className="p-2">
                                        <input
                                            type="checkbox"
                                            checked={selectedCompleted.includes(order.id)}
                                            onChange={e =>
                                                toggleSelect(order.id, e.target.checked, 'completed')
                                            }
                                        />
                                    </td>
                                    <td className="p-2">{order.customerName}</td>
                                    <td className="p-2">
                                        {new Date(order.creationDate).toLocaleDateString()}
                                    </td>
                                    <td className="p-2">
                                        {new Date(order.sendDate).toLocaleDateString()}
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>

                    {completedOrders.length > completedVisibleRows && (
                        <div className="mt-4 flex justify-center">
                            <button
                                onClick={() => setCompletedVisibleRows(prev => prev + 5)}
                                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                            >
                                Load More
                            </button>
                        </div>
                    )}
                </section>
            </main>

            <footer className="flex justify-center gap-4 p-8">
                <Link to="/adminsettings">
                    <MyButton label="Admin Settings" />
                </Link>
                <MyButton label="New Order" onClick={() => setShowOrderForm(true)} />
            </footer>

            {showOrderForm && (
                <OrderForm onClose={() => setShowOrderForm(false)} refreshOrders={fetchOrders} />
            )}
            {editingOrder && (
                <EditOrderForm
                    order={editingOrder}
                    onClose={() => setEditingOrder(null)}
                    refreshOrders={fetchOrders}
                />
            )}
        </div>
    );
};

export default OrdersPage;
