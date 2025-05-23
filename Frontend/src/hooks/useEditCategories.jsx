import { useEffect, useState } from 'react';
import api from '../services/api';
import Swal from 'sweetalert2';

/**
 * Custom React hook for managing and editing categories.
 * Provides logic for fetching, reordering, renaming, and deleting categories.
 * Also handles error/success messages and saving state.
 *
 * @returns {Object} Object containing category data, UI state, and utility functions:
 *   - fetchCategories: Function to load categories from the backend
 *   - handleDelete: Deletes a category by ID
 *   - saveNewOrder: Saves reordered list of categories
 *   - moveCategory: Moves a category from one index to another (used for drag and drop)
 *   - handleNameChange: Updates a category's name by ID
 *   - error: Error message (string)
 *   - saving: Boolean flag for ongoing save operation
 *   - successMessage: Message shown after successful action
 */
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
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to load categories',
                confirmButtonColor: '#3085d6'
            });
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

            Swal.fire({
                icon: 'success',
                title: 'Success',
                text: 'Category deleted successfully',
                timer: 2000,
                showConfirmButton: false
            });

            await fetchCategories();
        } catch {
            setError("Failed to delete category. It may be in use.");

            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to delete category. It may be in use.',
                confirmButtonColor: '#3085d6'
            });
        }
    };

    const saveNewOrder = async (updatedList) => {
        try {
            setSaving(true);
            setError('');

            // Check for duplicate names before saving
            const duplicateNames = findDuplicateNames(updatedList);
            if (duplicateNames) {
                setError(`A category named "${duplicateNames}" already exists`);

                Swal.fire({
                    icon: 'error',
                    title: 'Duplicate Name',
                    text: `A category named "${duplicateNames}" already exists`,
                    confirmButtonColor: '#3085d6'
                });

                setSaving(false);
                return;
            }

            const cleaned = updatedList.map((cat, index) => ({
                id: cat.id,
                name: cat.name.trim(),
                orderIndex: index
            }));

            console.log("Sending categories:", cleaned);
            await api.reorderCategories(cleaned);
            setSuccessMessage("Kategorier sparades");

            Swal.fire({
                icon: 'success',
                title: 'Success',
                text: 'Kategorier sparades',
                timer: 2000,
                showConfirmButton: false
            });

            await fetchCategories();
        } catch (err) {
            setError("Kunde inte spara ändringarna");

            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Kunde inte spara ändringarna',
                confirmButtonColor: '#3085d6'
            });
        } finally {
            setSaving(false);
        }
    };

    // Helper function to find duplicate names in the list
    const findDuplicateNames = (list) => {
        const nameMap = new Map();
        for (const cat of list) {
            const lowerName = cat.name.toLowerCase();
            if (nameMap.has(lowerName)) {
                return cat.name; // Return the duplicate name for error message
            }
            nameMap.set(lowerName, cat.id);
        }
        return null; // No duplicates found
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
        setError(''); // Clear any existing error when name changes
        setCategories(prev => prev.map(cat =>
            cat.id === id ? { ...cat, name: newName } : cat
        ));
        return true;
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
