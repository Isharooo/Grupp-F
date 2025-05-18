import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import keycloak from "../../keycloak";


const ProtectedAdminRoute = ({ children }) => {
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAdminRole = async () => {
            try {
                await keycloak.updateToken(30);
                const hasAdminRole = keycloak.hasRealmRole('admin');
                setIsAdmin(hasAdminRole);
            } catch (error) {
                console.error('Failed to check admin role:', error);
            } finally {
                setLoading(false);
            }
        };

        checkAdminRole();
    }, []);

    if (loading) {
        return <div className="flex justify-center items-center h-screen">Laddar...</div>;
    }

    return isAdmin ? children : <Navigate to="/orders" />;
};

export default ProtectedAdminRoute;
