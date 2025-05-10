import React from 'react';
import Background from '../components/common/Background';
import Title from '../components/common/Title';
import CategoryForm from '../components/products_categories/CategoryForm';
import { useNewCategory } from '../hooks/useNewCategory';

const NewCategory = () => {
    const { categoryName, setCategoryName, error, successMessage, saving, handleSave } = useNewCategory();
    return (
        <div className="relative min-h-screen flex flex-col items-center justify-center bg-white overflow-hidden">
            <Background />
            <Title />
            <div className="z-10 bg-white rounded-lg mt-8 w-full max-w-xl shadow flex flex-col justify-center h-full">
                <CategoryForm
                    categoryName={categoryName}
                    setCategoryName={setCategoryName}
                    error={error}
                    successMessage={successMessage}
                    isSaving={saving}
                    handleSave={handleSave}
                    returnLink="/AdminSettings"
                    title="New Category"
                />
            </div>
        </div>
    );
};
export default NewCategory;
