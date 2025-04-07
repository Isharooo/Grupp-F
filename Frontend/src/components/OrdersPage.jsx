import React from 'react';
// Exempelikoner från React Icons (du kan välja andra om du vill)
import { FaTrash, FaEdit, FaTruck, FaCheck } from 'react-icons/fa';
import Header from "./Header";

const OrdersPage = () => {
    return (
        <div className="min-h-screen bg-white">
            {/* Titel-rad överst */}
            <Header />

            {/* Orders-sektionen */}
            <section className="max-w-4xl mx-auto mt-8 px-4">
                <h2 className="text-lg font-bold mb-4">Orders</h2>
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
                        <tr className="border-b border-orange-200">
                            <td className="py-2">Geneta Minimarket</td>
                            <td className="py-2">2025-02-01</td>
                            <td className="py-2">2025-02-25</td>
                            <td className="py-2 space-x-2">
                                <button className="p-1 text-gray-700 hover:text-blue-500"><FaTruck /></button>
                                <button className="p-1 text-gray-700 hover:text-blue-500"><FaEdit /></button>
                                <button className="p-1 text-gray-700 hover:text-blue-500"><FaTrash /></button>
                            </td>
                        </tr>
                        <tr className="border-b border-orange-200">
                            <td className="py-2">Geneta Minimarket</td>
                            <td className="py-2">2025-02-01</td>
                            <td className="py-2">2025-02-25</td>
                            <td className="py-2 space-x-2">
                                <button className="p-1 text-gray-700 hover:text-blue-500"><FaCheck /></button>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>
                {/* "Load more"-knapp */}
                <div className="flex justify-center mt-4">
                    <button className="text-orange-500 hover:underline">Load more</button>
                </div>
            </section>

            {/* Completed Orders-sektionen */}
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
                        <tr className="border-b border-orange-200">
                            <td className="py-2">Geneta Minimarket</td>
                            <td className="py-2">2025-01-28</td>
                            <td className="py-2">2025-02-25</td>
                            <td className="py-2 space-x-2">
                                <button className="p-1 text-gray-700 hover:text-blue-500"><FaTrash /></button>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>
                {/* "Load more"-knapp */}
                <div className="flex justify-center mt-4">
                    <button className="text-orange-500 hover:underline">Load more</button>
                </div>
            </section>

            {/* Knappar längst ned */}
            <div className="flex justify-center space-x-4 my-8">
                <button className="bg-transparent border border-orange-400 text-orange-400 px-4 py-2 rounded hover:bg-orange-400 hover:text-white transition-colors">
                    Manage Products
                </button>
                <button className="bg-transparent border border-orange-400 text-orange-400 px-4 py-2 rounded hover:bg-orange-400 hover:text-white transition-colors">
                    New Order
                </button>
            </div>
        </div>
    );
};

export default OrdersPage;
