import React, { useState, useEffect } from 'react';
import { FaTrash, FaEdit, FaTruck, FaUndo, FaPrint, FaFileDownload } from 'react-icons/fa';
import Header from "./Header";
import api from '../services/api';
import OrderForm from './OrderForm';
import EditOrderForm from './EditOrderForm';

const OrdersPage = () => {
    const [orders, setOrders] = useState([]);
    const [completedOrders, setCompletedOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showOrderForm, setShowOrderForm] = useState(false);
    const [selectedActive, setSelectedActive] = useState([]);
    const [selectedCompleted, setSelectedCompleted] = useState([]);
    const [editingOrder, setEditingOrder] = useState(null);

    useEffect(() => { fetchOrders(); }, []);

    const fetchOrders = async () => {
        try {
            const response = await api.getOrders();
            const active = response.data.filter(order => !order.completed);
            const completed = response.data.filter(order => order.completed);
            setOrders(active);
            setCompletedOrders(completed);
            setLoading(false);  // <-- Lägg till detta
        } catch (error) {
            console.error('Error fetching orders:', error);
            setLoading(false);  // <-- Och detta
        }
    };

    const handleSelectActive = (id, isChecked) => {
        setSelectedActive(prev =>
            isChecked ? [...prev, id] : prev.filter(item => item !== id)
        );
    };

    const handleSelectCompleted = (id, isChecked) => {
        setSelectedCompleted(prev =>
            isChecked ? [...prev, id] : prev.filter(item => item !== id)
        );
    };

    const handleMarkSelectedAsSent = async () => {
        try {
            await Promise.all(selectedActive.map(id => api.markOrderAsSent(id)));
            await fetchOrders();
            setSelectedActive([]);
        } catch (error) {
            console.error('Error marking orders as sent:', error);
        }
    };

    const handleReturnSelectedToActive = async () => {
        try {
            await Promise.all(selectedCompleted.map(id => api.returnOrderToActive(id)));
            await fetchOrders();
            setSelectedCompleted([]);
        } catch (error) {
            console.error('Error returning orders to active:', error);
        }
    };

    const handleDeleteSelected = async (selectedIds, isActive) => {
        try {
            await Promise.all(selectedIds.map(id => api.deleteOrder(id)));
            await fetchOrders();
            isActive ? setSelectedActive([]) : setSelectedCompleted([]);
        } catch (error) {
            console.error('Error deleting orders:', error);
        }
    };

    if (loading) return <div className="text-center mt-8">Loading orders...</div>;

    return (
        <div className="min-h-screen bg-white">
            <Header />

            {/* Active Orders */}
            <section className="max-w-6xl mx-auto mt-8 px-4">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-bold">Active Orders</h2>
                    <div className="flex gap-2">
                        <button
                            onClick={handleMarkSelectedAsSent}
                            className="bg-blue-600 text-white px-3 py-1 rounded flex items-center gap-1"
                            disabled={!selectedActive.length}
                        >
                            <FaTruck /> Mark Sent
                        </button>
                        <button
                            onClick={() => handleDeleteSelected(selectedActive, true)}
                            className="bg-red-600 text-white px-3 py-1 rounded flex items-center gap-1"
                            disabled={!selectedActive.length}
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
                            <th className="p-2 text-left">Customer</th>
                            <th className="p-2 text-left">Created</th>
                            <th className="p-2 text-left">Send Date</th>
                            <th className="p-2 text-left">Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {orders.map(order => (
                            <tr key={order.id} className="border-b border-orange-200 hover:bg-gray-50">
                                <td className="p-2">
                                    <input
                                        type="checkbox"
                                        checked={selectedActive.includes(order.id)}
                                        onChange={(e) => handleSelectActive(order.id, e.target.checked)}
                                    />
                                </td>
                                <td className="p-2">{order.customerName}</td>
                                <td className="p-2">{new Date(order.creationDate).toLocaleDateString()}</td>
                                <td className="p-2">
                                    {order.sendDate
                                        ? new Date(order.sendDate).toLocaleDateString()
                                        : 'Pending'}
                                </td>
                                <td className="p-2 flex gap-2">
                                    <button
                                        onClick={() => setEditingOrder(order)}
                                        className="text-blue-600 hover:text-blue-800"
                                        title="Edit"
                                    >
                                        <FaEdit />
                                    </button>
                                    <button
                                        className="text-green-600 hover:text-green-800"
                                        title="Print"
                                    >
                                        <FaPrint />
                                    </button>
                                    <button
                                        className="text-purple-600 hover:text-purple-800"
                                        title="Download"
                                    >
                                        <FaFileDownload />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </section>

            {/* Completed Orders */}
            <section className="max-w-6xl mx-auto mt-8 px-4">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-bold">Completed Orders</h2>
                    <div className="flex gap-2">
                        <button
                            onClick={handleReturnSelectedToActive}
                            className="bg-green-600 text-white px-3 py-1 rounded flex items-center gap-1"
                            disabled={!selectedCompleted.length}
                        >
                            <FaUndo /> Return
                        </button>
                        <button
                            onClick={() => handleDeleteSelected(selectedCompleted, false)}
                            className="bg-red-600 text-white px-3 py-1 rounded flex items-center gap-1"
                            disabled={!selectedCompleted.length}
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
                            <th className="p-2 text-left">Customer</th>
                            <th className="p-2 text-left">Created</th>
                            <th className="p-2 text-left">Sent</th>
                        </tr>
                        </thead>
                        <tbody>
                        {completedOrders.map(order => (
                            <tr key={order.id} className="border-b border-orange-200 hover:bg-gray-50">
                                <td className="p-2">
                                    <input
                                        type="checkbox"
                                        checked={selectedCompleted.includes(order.id)}
                                        onChange={(e) => handleSelectCompleted(order.id, e.target.checked)}
                                    />
                                </td>
                                <td className="p-2">{order.customerName}</td>
                                <td className="p-2">{new Date(order.creationDate).toLocaleDateString()}</td>
                                <td className="p-2">{new Date(order.sendDate).toLocaleDateString()}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </section>

            {/* Action Buttons */}
            <div className="flex justify-center gap-4 my-8">
                <button className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600">
                    Manage Products
                </button>
                <button
                    onClick={() => setShowOrderForm(true)}
                    className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
                >
                    New Order
                </button>
            </div>

            {showOrderForm && (
                <OrderForm
                    onClose={() => setShowOrderForm(false)}
                    refreshOrders={fetchOrders}
                />
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