import React, { useState, useEffect } from 'react';
import { FaTrash, FaEdit, FaTruck, FaCheck } from 'react-icons/fa';
import Header from "./Header";
import api from '../services/api';
import OrderForm from './OrderForm';

const OrdersPage = () => {
    const [orders, setOrders] = useState([]);
    const [completedOrders, setCompletedOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showOrderForm, setShowOrderForm] = useState(false);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const response = await api.getOrders();
            const active = response.data.filter(order => !order.sendDate);
            const completed = response.data.filter(order => order.sendDate);
            setOrders(active);
            setCompletedOrders(completed);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching orders:', error);
        }
    };

    const handleDelete = async (id) => {
        try {
            await api.deleteOrder(id);
            await fetchOrders();
        } catch (error) {
            console.error('Error deleting order:', error);
        }
    };

    const handleMarkAsSent = async (id) => {
        try {
            const order = orders.find(o => o.id === id);
            await api.updateOrder(id, { ...order, sendDate: new Date().toISOString() });
            await fetchOrders();
        } catch (error) {
            console.error('Error updating order:', error);
        }
    };

    if (loading) return <div className="text-center mt-8">Loading orders...</div>;

    return (
        <div className="min-h-screen bg-white">
            <Header />

            {/* Active Orders */}
            <section className="max-w-4xl mx-auto mt-8 px-4">
                <h2 className="text-lg font-bold mb-4">Active Orders</h2>
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                        <tr className="border-b-2 border-orange-300">
                            <th className="py-2 text-left">Customer Name</th>
                            <th className="py-2 text-left">Creation date</th>
                            <th className="py-2 text-left">Send date</th>
                            <th className="py-2 text-left">Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {orders.map(order => (
                            <tr key={order.id} className="border-b border-orange-200">
                                <td className="py-2">{order.customerName}</td>
                                <td className="py-2">{new Date(order.creationDate).toLocaleDateString()}</td>
                                <td className="py-2">
                                    {order.sendDate
                                        ? new Date(order.sendDate).toLocaleDateString()
                                        : 'Pending'}
                                </td>
                                <td className="py-2 space-x-2">
                                    {!order.sendDate && (
                                        <>
                                            <button
                                                onClick={() => handleMarkAsSent(order.id)}
                                                className="p-1 text-gray-700 hover:text-blue-500"
                                                title="Mark as sent"
                                            >
                                                <FaTruck />
                                            </button>
                                            <button
                                                className="p-1 text-gray-700 hover:text-blue-500"
                                                title="Edit order"
                                            >
                                                <FaEdit />
                                            </button>
                                        </>
                                    )}
                                    <button
                                        onClick={() => handleDelete(order.id)}
                                        className="p-1 text-gray-700 hover:text-red-500"
                                        title="Delete order"
                                    >
                                        <FaTrash />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </section>

            {/* Completed Orders */}
            <section className="max-w-4xl mx-auto mt-8 px-4">
                <h2 className="text-lg font-bold mb-4">Completed Orders</h2>
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                        <tr className="border-b-2 border-orange-300">
                            <th className="py-2 text-left">Customer Name</th>
                            <th className="py-2 text-left">Creation date</th>
                            <th className="py-2 text-left">Send date</th>
                            <th className="py-2 text-left">Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {completedOrders.map(order => (
                            <tr key={order.id} className="border-b border-orange-200">
                                <td className="py-2">{order.customerName}</td>
                                <td className="py-2">{new Date(order.creationDate).toLocaleDateString()}</td>
                                <td className="py-2">{new Date(order.sendDate).toLocaleDateString()}</td>
                                <td className="py-2">
                                    <button
                                        onClick={() => handleDelete(order.id)}
                                        className="p-1 text-gray-700 hover:text-red-500"
                                        title="Delete order"
                                    >
                                        <FaTrash />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </section>

            {/* Action Buttons */}
            <div className="flex justify-center space-x-4 my-8">
                <button className="bg-transparent border border-orange-400 text-orange-400 px-4 py-2 rounded hover:bg-orange-400 hover:text-white transition-colors">
                    Manage Products
                </button>
                <button
                    onClick={() => setShowOrderForm(true)}
                    className="bg-transparent border border-orange-400 text-orange-400 px-4 py-2 rounded hover:bg-orange-400 hover:text-white transition-colors"
                >
                    New Order
                </button>
            </div>

            {/* Order Form Modal */}
            {showOrderForm && (
                <OrderForm
                    onClose={() => setShowOrderForm(false)}
                    refreshOrders={fetchOrders}
                />
            )}
        </div>
    );
};

export default OrdersPage;