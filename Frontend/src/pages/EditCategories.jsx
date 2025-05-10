import React from 'react';
import Background from '../components/common/Background';
import Title from '../components/common/Title';
import CategoryForm from '../components/products_categories/CategoryForm';
import { useEditCategories } from '../hooks/useEditCategories';

const EditCategories = () => {
    const {
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
    } = useEditCategories();

    return (
        <div className="relative min-h-screen flex flex-col items-center justify-center bg-white overflow-hidden">
            <Background />
            <Title />
            <CategoryForm
                title="Edit Category"
                categoryName={categoryName}
                setCategoryName={setCategoryName}
                error={error}
                successMessage={successMessage}
                saving={saving}
                handleSave={handleSave}
                returnLink="/AdminSettings"
                showDelete={true}
                handleDelete={handleDelete}
                deleting={deleting}
                categories={categories}
                selectedId={selectedId}
                setSelectedId={setSelectedId}
                disabled={!selectedId}
            />
        </div>
    );
};

export default EditCategories;
