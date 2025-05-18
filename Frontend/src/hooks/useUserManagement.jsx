import { useState, useCallback } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:8081/api/users';

export const useUserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [isUpdating, setIsUpdating] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    // Hämta alla användare
    const fetchUsers = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const response = await axios.get(`${API_URL}/all`);
            setUsers(response.data);
        } catch (err) {
            setError('Failed to load users');
        } finally {
            setLoading(false);
        }
    }, []);

    // Uppdatera användare
    const updateUser = useCallback(async (userId, { username, password }) => {
        setIsUpdating(true);
        setError('');
        setSuccessMessage('');
        try {
            if (username) {
                await axios.put(`${API_URL}/${userId}/username`, { username });
            }
            if (password) {
                await axios.put(`${API_URL}/${userId}/reset-password`, {
                    value: password,
                    temporary: false,
                    type: "password"
                });
            }
            setSuccessMessage('User updated successfully');
            await fetchUsers();
        } catch (err) {
            setError('Failed to update user');
        } finally {
            setIsUpdating(false);
        }
    }, [fetchUsers]);

    // Ta bort användare
    const deleteUser = useCallback(async (userId) => {
        setIsDeleting(true);
        setError('');
        setSuccessMessage('');
        try {
            await axios.delete(`${API_URL}/${userId}`);
            setSuccessMessage('User deleted successfully');
            await fetchUsers();
        } catch (err) {
            setError('Failed to delete user');
        } finally {
            setIsDeleting(false);
        }
    }, [fetchUsers]);

    return {
        users,
        loading,
        error,
        successMessage,
        isUpdating,
        isDeleting,
        fetchUsers,
        updateUser,
        deleteUser,
        setError,
        setSuccessMessage
    };
};
