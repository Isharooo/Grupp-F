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
import KeycloakProvider from "./keycloakProvider";
import ProtectedAdminRoute from './components/common/ProtectedAdminRoute';

function App() {
    return (
        <KeycloakProvider>
            <Router>
                <Routes>
                    <Route path="/" element={<LoginPage />} />
                    <Route path="/orders" element={<OrdersPage />} />
                    <Route path="/orders/:orderId/products" element={<ProductsPage />} />
                    <Route path="/orders/:orderId/finish" element={<FinishOrder />} />

                    {/* Skyddade admin-routes */}
                    <Route path="/adminsettings" element={
                        <ProtectedAdminRoute>
                            <AdminSettingsPage />
                        </ProtectedAdminRoute>
                    } />
                    <Route path="/NewProduct" element={
                        <ProtectedAdminRoute>
                            <NewProduct />
                        </ProtectedAdminRoute>
                    } />
                    <Route path="/EditProducts" element={
                        <ProtectedAdminRoute>
                            <EditProducts />
                        </ProtectedAdminRoute>
                    } />
                    <Route path="/NewCategory" element={
                        <ProtectedAdminRoute>
                            <NewCategory />
                        </ProtectedAdminRoute>
                    } />
                    <Route path="/EditCategories" element={
                        <ProtectedAdminRoute>
                            <EditCategories />
                        </ProtectedAdminRoute>
                    } />
                    <Route path="/NewAccount" element={
                        <ProtectedAdminRoute>
                            <NewAccount />
                        </ProtectedAdminRoute>
                    } />
                    <Route path="/EditAccounts" element={
                        <ProtectedAdminRoute>
                            <EditAccounts />
                        </ProtectedAdminRoute>
                    } />
                </Routes>
            </Router>
        </KeycloakProvider>
    );
}

export default App;
