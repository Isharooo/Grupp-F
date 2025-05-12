import { useState } from 'react';
import api from '../services/api';

/**
 * Custom React hook for creating a new category.
 * Manages input state, validation, duplicate checking, order index assignment, and save operation.
 *
 * @returns {Object} Object containing state and a save handler:
 *   - error: Error message (string)
 *   - successMessage: Success message (string)
 *   - saving: Boolean flag indicating if the category is being saved
 *   - handleSave: Function to validate and save the new category
 */
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
            const res = await api.getCategories();
            const all = res.data;

            const exists = all.some(cat =>
                cat.name.trim().toLowerCase() === categoryName.trim().toLowerCase()
            );

            if (exists) {
                setError("Category name already exists");
                return;
            }

            const nextOrderIndex = all.length > 0
                ? Math.max(...all.map(cat => cat.orderIndex ?? 0)) + 1
                : 0;

            await api.addCategory({
                name: categoryName.trim(),
                orderIndex: nextOrderIndex
            });

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