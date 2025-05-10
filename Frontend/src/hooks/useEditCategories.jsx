import { useEffect, useState } from 'react';
import api from '../services/api';

export function useEditCategories() {
    const [categories, setCategories] = useState([]);
    const [error, setError] = useState('');
    const [saving, setSaving] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    const fetchCategories = async () => {
        try {
            const res = await api.getCategories();
            setCategories(res.data);
        } catch {
            setError("Failed to load categories");
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleDelete = async (id) => {
        try {
            await api.deleteCategory(id);
            setSuccessMessage("Category deleted");
            setTimeout(() => setSuccessMessage(""), 3000);
        } catch {
            setError("Failed to delete category. It may be in use.");
        }
    };

    const saveNewOrder = async (updatedList) => {
        try {
            setSaving(true);
            setError('');
            const cleaned = updatedList.map((cat, index) => ({
                id: cat.id,
                name: cat.name.trim(),
                orderIndex: index
            }));
            await api.reorderCategories(cleaned);
            setSuccessMessage("Kategorier sparades");
            setTimeout(() => setSuccessMessage(""), 3000);
        } catch {
            setError("Kunde inte spara ändringarna");
        } finally {
            setSaving(false);
        }
    };

    return {
        categories,
        setCategories,
        fetchCategories,
        handleDelete,
        saveNewOrder,
        error,
        saving,
        successMessage
    };
}
