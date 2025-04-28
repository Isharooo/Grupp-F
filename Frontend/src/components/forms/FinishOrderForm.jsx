import React from 'react';
import { FaPrint, FaFileDownload, FaSave } from 'react-icons/fa';
import MyButton from '../common/Button';
import OrderItemsTable from '../tables/OrderItemsTable';
import useFinishOrder from '../../hooks/useFinishOrder';
import { useNavigate } from 'react-router-dom';

const FinishOrderForm = () => {
    const navigate = useNavigate();
    const {
        selectedItems, companyName, setCompanyName, sendDate, setSendDate,
        error, isSaving, handleSave
    } = useFinishOrder();

    const handlePrint = () => window.print();
    const handleDownloadPdf = () => alert('PDF download functionality would be implemented here');

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
                <div className="bg-red-100 text-red-700 p-4 rounded mb-4 max-w-md">
                    {error}
                </div>
                <MyButton label="Go Back" onClick={() => navigate('/orders')} />
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen bg-white">
            <div className="max-w-6xl mx-auto w-full px-4 py-6">
                <div className="bg-white border rounded-lg shadow-md p-6 mb-6">
                    <h2 className="text-xl font-bold mb-4">Order Summary</h2>

                    {/* Formulär */}
                    <div className="mb-6">
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Company Name *
                            </label>
                            <input
                                type="text"
                                value={companyName}
                                onChange={(e) => setCompanyName(e.target.value)}
                                className="w-full border rounded p-2"
                                placeholder="Enter company name"
                                required
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Send Date (optional)
                            </label>
                            <input
                                type="date"
                                value={sendDate}
                                onChange={(e) => setSendDate(e.target.value)}
                                className="w-full border rounded p-2"
                            />
                        </div>
                    </div>

                    {/* Produkttabell */}
                    <OrderItemsTable items={selectedItems} />

                    {/* Knappar */}
                    <div className="flex justify-center gap-4">
                        <button
                            onClick={handlePrint}
                            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                        >
                            <FaPrint /> Print
                        </button>
                        <button
                            onClick={handleDownloadPdf}
                            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
                        >
                            <FaFileDownload /> Download PDF
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={isSaving}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                            <FaSave /> {isSaving ? 'Saving...' : 'Save Order'}
                        </button>
                    </div>
                </div>

                <div className="flex justify-center">
                    <MyButton
                        label="Back to Orders"
                        onClick={() => {
                            if (window.confirm('Are you sure? Your changes will not be saved.')) {
                                navigate('/orders');
                            }
                        }}
                    />
                </div>
            </div>
        </div>
    );
};

export default FinishOrderForm;
