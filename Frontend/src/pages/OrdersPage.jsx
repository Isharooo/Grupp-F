import React, {useEffect, useState} from 'react';
import { FaTrash, FaTruck, FaUndo } from 'react-icons/fa';
import Header from '../components/common/Header';
import MyButton from '../components/common/Button';
import OrdersTable from '../components/tables/OrdersTable';
import { Link, useNavigate } from "react-router-dom";
import { useOrdersManagement } from '../hooks/useOrdersManagement';

import keycloak from '../keycloak';

const handleLogout = () => {
    keycloak.logout({ redirectUri: window.location.origin });
};

const OrdersSection = ({
                           title,
                           orders,
                           selectedIds,
                           totalCount,
                           setSelectedIds,
                           actionButtons,
                           columns,
                           setVisibleRows,
                           sortConfig,
                           onSort,
                           setEditingOrder,
                           isActiveSection,
                           onDownload,
                           recentlyReturnedOrderIds
                       }) => (
    <section className="max-w-6xl mx-auto mt-8 px-4">
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold">{title}</h2>
            <div className="flex gap-2">{actionButtons}</div>
        </div>
        <div className="overflow-x-auto">
            <OrdersTable
                orders={orders}
                selectedIds={selectedIds}
                setSelectedIds={setSelectedIds}
                columns={columns}
                sortConfig={sortConfig}
                onSort={onSort}
                setEditingOrder={setEditingOrder}
                isActiveSection={isActiveSection}
                recentlyReturnedOrderIds={recentlyReturnedOrderIds}
                onDownload={onDownload}
            />
        </div>
        {totalCount > orders.length && (
            <div className="mt-4 flex justify-center">
                <button
                    onClick={() => setVisibleRows(prev => prev + 5)}
                    className=" text-blue-600 rounded hover:text-blue-700"
                >
                    Load More
                </button>
            </div>
        )}
    </section>
);

const OrdersPage = () => {
    const navigate = useNavigate();
    const {
        orders,
        completedOrders,
        loading,
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
        handleSort,
        markSent,
        returnToActive,
        deleteOrders,
        handleNewOrder,
        downloadOrderPdf,
        isAdmin
    } = useOrdersManagement();

    if (loading) {
        return <div className="text-center mt-8">Loading orders…</div>;
    }

    const visibleActive = sortOrders(orders, activeSortConfig).slice(0, activeVisibleRows);
    const visibleCompleted = sortOrders(completedOrders, completedSortConfig).slice(0, completedVisibleRows);

    const activeColumns = [
        { label: 'Customer', field: 'customerName' },
        { label: 'Created', field: 'creationDate' },
        { label: 'Send Date', field: 'sendDate' }
    ];

    const completedColumns = [
        { label: 'Customer', field: 'customerName' },
        { label: 'Created', field: 'creationDate' },
        { label: 'Sent', field: 'sendDate' }
    ];

    const activeButtons = [
        <button
            key="mark-sent"
            onClick={markSent}
            disabled={!selectedActive.length}
            className="flex items-center gap-2 px-3 py-1 border-2 border-blue-600 text-blue-600 rounded hover:bg-blue-600 hover:text-white"
        >
            <FaTruck /> Mark Sent
        </button>,
        <button
            key="delete-active"
            onClick={() => deleteOrders(selectedActive, 'active')}
            disabled={!selectedActive.length}
            className="flex items-center gap-2 px-3 py-1 border-2 border-red-600 text-red-600 rounded hover:bg-red-600 hover:text-white"
        >
            <FaTrash /> Delete
        </button>
    ];

    const completedButtons = [
        <button
            key="return"
            onClick={returnToActive}
            disabled={!selectedCompleted.length}
            className="flex items-center gap-2 px-3 py-1 border-2 border-green-600 text-green-600 rounded hover:bg-green-600 hover:text-white"
        >
            <FaUndo /> Return
        </button>,
        <button
            key="delete-completed"
            onClick={() => deleteOrders(selectedCompleted, 'completed')}
            disabled={!selectedCompleted.length}
            className="flex items-center gap-2 px-3 py-1 border-2 border-red-600 text-red-600 rounded hover:bg-red-600 hover:text-white"
        >
            <FaTrash /> Delete
        </button>
    ];

    const handleEditOrder = (order) => {
        navigate(`/orders/${order.id}/products`);
    };

    return (
        <div className="flex flex-col min-h-screen bg-white">
            <Header />
            <main className="flex-grow">
                <OrdersSection
                    title="Active Orders"
                    orders={visibleActive}
                    totalCount={orders.length}
                    selectedIds={selectedActive}
                    setSelectedIds={setSelectedActive}
                    actionButtons={activeButtons}
                    columns={activeColumns}
                    visibleRows={activeVisibleRows}
                    setVisibleRows={setActiveVisibleRows}
                    sortConfig={activeSortConfig}
                    onSort={(field, direction) => handleSort('active', field, direction)}
                    setEditingOrder={handleEditOrder}
                    isActiveSection={true}
                    recentlyReturnedOrderIds={recentlyReturnedOrderIds}
                    onDownload={downloadOrderPdf}
                />
                <OrdersSection
                    title="Completed Orders"
                    orders={visibleCompleted}
                    totalCount={completedOrders.length}
                    selectedIds={selectedCompleted}
                    setSelectedIds={setSelectedCompleted}
                    actionButtons={completedButtons}
                    columns={completedColumns}
                    visibleRows={completedVisibleRows}
                    setVisibleRows={setCompletedVisibleRows}
                    sortConfig={completedSortConfig}
                    onSort={(field, direction) => handleSort('completed', field, direction)}
                    setEditingOrder={null}
                    isActiveSection={false}
                    recentlyReturnedOrderIds={recentlyReturnedOrderIds}
                    onDownload={downloadOrderPdf}
                />
            </main>
            <footer className="flex justify-center gap-4 p-8">
                <MyButton label="Log out" onClick={handleLogout} />
                {isAdmin && (
                    <Link to="/adminsettings">
                        <MyButton label="Admin Settings" />
                    </Link>
                )}
                <MyButton label="New Order" onClick={handleNewOrder} />
            </footer>
        </div>
    );
};

export default OrdersPage;
