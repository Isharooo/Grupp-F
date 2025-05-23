// src/KeycloakProvider.js
import React, { useEffect, useState, useRef } from "react";
import keycloak from "./keycloak";

const AuthContext = React.createContext();

export const useAuth = () => React.useContext(AuthContext);

export default function KeycloakProvider({ children }) {
    const [authenticated, setAuthenticated] = useState(false);
    const isInitialized = useRef(false); // Ny referens för att spåra initialisering

    useEffect(() => {
        console.log("KeycloakProvider useEffect: Initializing Keycloak..."); // Added log
        if (isInitialized.current) return; // Avbryt om redan initialiserat

        isInitialized.current = true; // Markera som initialiserat

        keycloak.init({
            onLoad: "login-required",
            checkLoginIframe: false,
        }).then((auth) => {
            console.log("Keycloak init success - Authenticated flag from init:", auth); // Added log
            if (auth) {
                setAuthenticated(true);
            } else {
                console.warn("Keycloak init - Not authenticated after init, attempting login."); // Added log
                keycloak.login();
            }
        }).catch((error) => {
            console.error("Keycloak init error:", error);
        });

        // Add event listeners for token lifecycle
        keycloak.onAuthRefreshSuccess = () => {
            console.log("Keycloak token refreshed successfully");
            setAuthenticated(true); // Ensure authenticated state is up-to-date
        };

        keycloak.onAuthRefreshError = () => {
            console.error("Keycloak token refresh failed. User might need to login again.");
            // Consider automatically redirecting to login or showing a user-friendly message
            // keycloak.login(); 
        };

        keycloak.onTokenExpired = () => {
            console.warn("Keycloak token expired. Attempting refresh...");
            keycloak.updateToken(30) // 30 seconds minimum validity
                .then(refreshed => {
                    if (refreshed) {
                        console.log("Token was successfully refreshed by onTokenExpired handler.");
                    } else {
                        console.log("Token is still valid (checked by onTokenExpired handler).");
                    }
                })
                .catch(() => {
                    console.error("Failed to refresh token via onTokenExpired handler. Forcing login.");
                    keycloak.login();
                });
        };

    }, []); // Empty dependency array

    console.log("KeycloakProvider rendering - current authenticated state:", authenticated); // Added log
    if (!authenticated) return <div>Loading...</div>;

    return (
        <AuthContext.Provider value={{ keycloak }}>
            {children}
        </AuthContext.Provider>
    );
}