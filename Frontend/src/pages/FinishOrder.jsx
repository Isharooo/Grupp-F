import React from 'react';
import { FaPrint, FaFileDownload } from 'react-icons/fa';
import MyButton from '../components/common/Button';
import OrderItemsTable from '../components/tables/OrderItemsTable';
import useFinishOrder from '../hooks/useFinishOrder';
import { useNavigate, useParams } from 'react-router-dom';
import Background from "../components/common/Background";
import Title from "../components/common/Title";

const FinishOrder = () => {
    const navigate = useNavigate();
    const { orderId } = useParams(); // Extract the order ID from the URL parameters

    const {
        selectedItems,
        companyName,
        setCompanyName,
        sendDate,
        setSendDate,
        error,
        handleSave,
        handleDownloadPdf
    } = useFinishOrder();

    const handlePrint = () => window.print();

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
                <div className="bg-red-100 text-red-700 p-4 rounded mb-4 max-w-md">
                    {error}
                </div>
                <MyButton label="Go Back" onClick={() => navigate(`/orders/${orderId}/products`)} />
            </div>
        );
    }

    return (
        <div className="relative min-h-screen flex flex-col items-center justify-center bg-white overflow-hidden">
            <Background />
            <Title />
            <div className="z-10 bg-white rounded-lg mt-8 w-full max-w-4xl shadow-[0_0_8px_2px_rgba(251,146,60,0.3)] flex flex-col justify-center h-full px-10">
                <div className="my-8 text-center text-2xl text-[#166BB3] font-semibold">Order Summary</div>
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

                <OrderItemsTable items={selectedItems} />

                <div className="flex justify-center gap-4">
                    <button
                        onClick={handlePrint}
                        className="flex items-center gap-2 px-3 py-1 border-2 border-green-600 text-green-600 rounded hover:bg-green-600 hover:text-white"
                    >
                        <FaPrint /> Print
                    </button>
                    <button
                        onClick={handleDownloadPdf}
                        className="flex items-center gap-2 px-3 py-1 border-2 border-purple-600 text-purple-600 rounded hover:bg-purple-600 hover:text-white"
                    >
                        <FaFileDownload /> Download PDF
                    </button>
                </div>

                <div className="my-8 flex justify-center">
                    <MyButton
                        className="mx-8"
                        label="Back to Order"
                        onClick={() => {
                            if (window.confirm('Are you sure? Your changes will not be saved.')) {
                                navigate(`/orders/${orderId}/products`);
                            }
                        }}
                    />
                    <MyButton
                        className="mx-8"
                        label="Save"
                        onClick={handleSave}
                    />
                </div>
            </div>
            <footer className="my-8"></footer>
        </div>
    );
};

export default FinishOrder;
