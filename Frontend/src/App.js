import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import OrdersPage from './pages/OrdersPage';
import ProductsPage from './pages/ProductsPage';
import LoginPage from './pages/LoginPage';
import AdminSettingsPage from './pages/AdminSettingsPage';
import FinishOrderForm from './components/forms/FinishOrderForm';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/orders" element={<OrdersPage />} />
                <Route path="/orders/:orderId/products" element={<ProductsPage />} />
                <Route path="/orders/:orderId/finish" element={<FinishOrderForm />} />
                <Route path="/adminsettings" element={<AdminSettingsPage />} />
                <Route path="/" element={<Navigate to="/orders" replace />} />
            </Routes>
        </Router>
    );
}

export default App;
