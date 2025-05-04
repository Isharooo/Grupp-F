import { useState } from 'react';
import api from '../services/api';

export function useNewCategory() {
    const [categoryName, setCategoryName] = useState('');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [saving, setSaving] = useState(false);

    const handleSave = async () => {
        if (!categoryName.trim()) {
            setError("Category name is required");
            setSuccessMessage('');
            return;
        }
        setSaving(true);
        setError('');
        setSuccessMessage('');
        try {
            await api.addCategory({ name: categoryName.trim() });
            setSuccessMessage("Category created successfully!");
            setCategoryName('');
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (e) {
            setError("Failed to save category. Please try again.");
        } finally {
            setSaving(false);
        }
    };

    return {
        categoryName,
        setCategoryName,
        error,
        successMessage,
        saving,
        handleSave,
    };
}
