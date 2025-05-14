// src/KeycloakProvider.js
import React, { useEffect, useState, useRef } from "react";
import keycloak from "./keycloak";

const AuthContext = React.createContext();

export const useAuth = () => React.useContext(AuthContext);

export default function KeycloakProvider({ children }) {
    const [authenticated, setAuthenticated] = useState(false);
    const isInitialized = useRef(false); // Ny referens för att spåra initialisering

    useEffect(() => {
        if (isInitialized.current) return; // Avbryt om redan initialiserat

        isInitialized.current = true; // Markera som initialiserat

        keycloak.init({
            onLoad: "login-required",
            checkLoginIframe: false,
        }).then((auth) => {
            if (auth) {
                setAuthenticated(true);
            } else {
                keycloak.login();
            }
        }).catch((error) => {
            console.error("Keycloak init error:", error);
        });

    }, []); // Empty dependency array

    if (!authenticated) return <div>Loading...</div>;

    return (
        <AuthContext.Provider value={{ keycloak }}>
            {children}
        </AuthContext.Provider>
    );
}