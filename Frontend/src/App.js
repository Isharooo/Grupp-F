import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import OrdersPage from './pages/OrdersPage';
import ProductsPage from './pages/ProductsPage';
import LoginPage from './pages/LoginPage';
import AdminSettingsPage from './pages/AdminSettingsPage';
import FinishOrder from './pages/FinishOrder';
import NewProduct from "./pages/NewProduct"
import EditProducts from "./pages/EditProducts"
import NewCategory from "./pages/NewCategory"
import EditCategories from "./pages/EditCategories"
import NewAccount from "./pages/NewAccount";
import EditAccounts from "./pages/EditAccounts";


function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<LoginPage />} />
                <Route path="/orders" element={<OrdersPage />} />
                <Route path="/orders/:orderId/products" element={<ProductsPage />} />
                <Route path="/orders/:orderId/finish" element={<FinishOrder />} />
                <Route path="/adminsettings" element={<AdminSettingsPage />} />
                <Route path="/NewProduct" element={<NewProduct />} />
                <Route path="/EditProducts" element={<EditProducts />} />
                <Route path="/NewCategory" element={<NewCategory />} />
                <Route path="/EditCategories" element={<EditCategories />} />
                <Route path="/NewAccount" element={<NewAccount />} />
                <Route path="/EditAccounts" element={<EditAccounts />} />
            </Routes>
        </Router>
    );
}

export default App;
