import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import LoginPage from "./components/pages/LoginPage"
import OrdersPage from "./components/pages/OrdersPage"
import AdminSettingsPage from "./components/pages/AdminSettingsPage"
import NewProduct from "./components/pages/NewProduct"

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<LoginPage />} />
                <Route path="/orders" element={<OrdersPage />} />
                <Route path="/adminsettings" element={<AdminSettingsPage />} />
                <Route path="/NewProduct" element={<NewProduct />} />
            </Routes>
        </Router>
    )
}

export default App
