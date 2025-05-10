import { useEffect, useState } from 'react';
import api from '../services/api';

export function useEditCategories() {
    const [categories, setCategories] = useState([]);
    const [selectedId, setSelectedId] = useState('');
    const [categoryName, setCategoryName] = useState('');
    const [error, setError] = useState('');
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const res = await api.getCategories();
            setCategories(res.data);
        } catch {
            setError("Failed to load categories");
        }
    };

    useEffect(() => {
        if (!selectedId) {
            setCategoryName('');
            return;
        }
        const cat = categories.find(c => String(c.id) === String(selectedId));
        setCategoryName(cat?.name || '');
    }, [selectedId, categories]);

    const handleSave = async () => {
        if (!selectedId) {
            setError("Please select a category");
            return;
        }
        if (!categoryName.trim()) {
            setError("Category name is required");
            return;
        }
        // Validera att namnet inte redan finns
        const isDuplicate = categories.some(cat =>
            cat.id !== parseInt(selectedId) &&
            cat.name.trim().toLowerCase() === categoryName.trim().toLowerCase()
        );

        if (isDuplicate) {
            setError("Det finns redan en kategori med detta namn");
            return;
        }
        setSaving(true);
        setError('');
        try {
            await api.updateCategory(selectedId, { name: categoryName.trim() });
            await fetchCategories();
        } catch {
            setError("Failed to update category. Please try again.");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!selectedId) {
            setError("Please select a category to delete");
            return;
        }
        if (!window.confirm("Are you sure you want to delete this category?")) return;
        setDeleting(true);
        setError('');
        try {
            await api.deleteCategory(selectedId);
            setCategories(categories.filter(c => String(c.id) !== String(selectedId)));
            setSelectedId('');
            setCategoryName('');
            setSuccessMessage("Kategorin togs bort!");
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (e) {
            setError("Failed to delete category. It may be in use.");
        } finally {
            setDeleting(false);
        }
    };

    return {
        categories,
        selectedId,
        setSelectedId,
        categoryName,
        setCategoryName,
        error,
        saving,
        deleting,
        successMessage,
        handleSave,
        handleDelete,
    };
}
