import React, { useEffect, useState } from 'react';
import Background from '../components/common/Background';
import Title from '../components/common/Title';
import { useEditCategories } from '../hooks/useEditCategories';
import CategoryReorderForm from '../components/products_categories/CategoryReorderForm';

const EditCategories = () => {
    const {
        categories,
        setCategories,
        handleDelete,
        error,
        successMessage,
        saving,
        saveNewOrder,
        fetchCategories
    } = useEditCategories();

    const [localCategories, setLocalCategories] = useState([]);

    useEffect(() => {
        setLocalCategories(categories);
    }, [categories]);

    const handleDragEnd = (result) => {
        if (!result.destination) return;
        const updated = Array.from(localCategories);
        const [moved] = updated.splice(result.source.index, 1);
        updated.splice(result.destination.index, 0, moved);
        setLocalCategories(updated);
    };

    const handleNameChange = (id, newName) => {
        setLocalCategories(prev => prev.map(cat =>
            cat.id === id ? { ...cat, name: newName } : cat
        ));
    };

    const handleSaveAll = async () => {
        await saveNewOrder(localCategories);
        await fetchCategories();
    };

    const handleDeleteCategory = async (id) => {
        await handleDelete(id);
        await fetchCategories();
    };

    return (
        <div className="relative min-h-screen flex flex-col items-center justify-center bg-white overflow-hidden">
            <Background />
            <Title />
            <CategoryReorderForm
                categories={localCategories}
                onNameChange={handleNameChange}
                onDelete={handleDeleteCategory}
                onDragEnd={handleDragEnd}
                onSave={handleSaveAll}
                saving={saving}
                error={error}
                successMessage={successMessage}
            />
        </div>
    );
};

export default EditCategories;
