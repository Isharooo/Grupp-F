import React, { useState } from 'react';
import api from '../services/api';

const EditOrderForm = ({ order, onClose, refreshOrders }) => {
    const [customerName, setCustomerName] = useState(order.customerName);
    const [sendDate, setSendDate] = useState(order.sendDate?.slice(0, 10) || '');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.updateOrder(order.id, {
                customerName,
                sendDate: sendDate || null
            });
            refreshOrders();
            onClose();
        } catch (error) {
            console.error('Error updating order:', error);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20">
            <div className="bg-white p-6 rounded-lg w-96">
                <h3 className="text-xl font-bold mb-4">Edit Order</h3>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">Customer Name</label>
                        <input
                            type="text"
                            className="w-full p-2 border rounded"
                            value={customerName}
                            onChange={(e) => setCustomerName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">Send Date</label>
                        <input
                            type="date"
                            className="w-full p-2 border rounded"
                            value={sendDate}
                            onChange={(e) => setSendDate(e.target.value)}
                        />
                    </div>
                    <div className="flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-gray-600 hover:text-gray-800"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditOrderForm;