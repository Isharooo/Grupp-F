import React from 'react';
import Background from '../components/common/Background';
import Title from '../components/common/Title';
import { useEditCategories } from '../hooks/useEditCategories';
import EditCategoryForm from '../tailwindCss/EditCategoryForm';

const EditCategories = () => {
    const {
        categories,
        handleDelete,
        error,
        successMessage,
        saving,
        saveNewOrder,
        moveCategory,
        handleNameChange
    } = useEditCategories();

    return (
        <div className="relative min-h-screen flex flex-col items-center justify-center bg-white overflow-hidden">
            <Background />
            <Title />
            <EditCategoryForm
                categories={categories}
                onNameChange={handleNameChange}
                onDelete={handleDelete}
                onSave={() => saveNewOrder(categories)}
                saving={saving}
                error={error}
                successMessage={successMessage}
                moveCategory={moveCategory}
            />
        </div>
    );
};

export default EditCategories;
