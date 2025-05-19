import { useState, useCallback } from 'react';
import api from '../services/api';

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
            const response = await api.getAllUsers();
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
                await api.updateUsername(userId, username);
            }
            if (password) {
                await api.resetPassword(userId, password);
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
            await api.deleteUser(userId);
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