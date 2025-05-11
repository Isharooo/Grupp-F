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
        const load = async () => {
            await fetchCategories();
        };
        load();
    }, []);

    const handleDelete = async (id) => {
        try {
            await api.deleteCategory(id);
            setSuccessMessage("Category deleted");
            setTimeout(() => setSuccessMessage(""), 3000);
            await fetchCategories();
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
            console.log("Sending categories:", cleaned);
            await api.reorderCategories(cleaned);
            setSuccessMessage("Kategorier sparades");
            setTimeout(() => setSuccessMessage(""), 3000);
            await fetchCategories();
        } catch {
            setError("Kunde inte spara ändringarna");
        } finally {
            setSaving(false);
        }
    };

    const moveCategory = (fromIndex, toIndex) => {
        setCategories(prev => {
            const updated = [...prev];
            const [moved] = updated.splice(fromIndex, 1);
            updated.splice(toIndex, 0, moved);
            return updated;
        });
    };

    const handleNameChange = (id, newName) => {
        setCategories(prev => prev.map(cat =>
            cat.id === id ? { ...cat, name: newName } : cat
        ));
    };

    return {
        categories,
        setCategories,
        fetchCategories,
        handleDelete,
        saveNewOrder,
        moveCategory,
        handleNameChange,
        error,
        saving,
        successMessage
    };
}