import { useState } from 'react';
import api from "../services/api";


export const useNewAccount = (onSuccess) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSave = async () => {
        if (!username || !password) {
            setError('Username and password are required');
            return;
        }
        setLoading(true);
        setError('');
        try {
            await api.createUser({ username, password });
            if (onSuccess) onSuccess();
        } catch (err) {
            setError('Failed to create account');
        } finally {
            setLoading(false);
        }
    };

    return {
        username,
        setUsername,
        password,
        setPassword,
        error,
        loading,
        handleSave,
        setError
    };
};
