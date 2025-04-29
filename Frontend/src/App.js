import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import OrdersPage from './pages/OrdersPage';
import OrdersPage1 from '.components/pages/OrdersPage';
import ProductsPage from './pages/ProductsPage';
import LoginPage from './pages/LoginPage';
import AdminSettingsPage from './pages/AdminSettingsPage';
import FinishOrderForm from './components/forms/FinishOrderForm';
import NewProduct from "./components/pages/NewProduct"


function App() {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/orders" element={<OrdersPage />} />
                <Route path="/orders1" element={<OrdersPage1 />} />
                <Route path="/orders/:orderId/products" element={<ProductsPage />} />
                <Route path="/orders/:orderId/finish" element={<FinishOrderForm />} />
                <Route path="/adminsettings" element={<AdminSettingsPage />} />
                <Route path="/NewProduct" element={<NewProduct />} />

            </Routes>
        </Router>
    );
}

export default App;
