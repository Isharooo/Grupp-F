import React from 'react';
import Background from '../components/common/Background';
import Title from '../components/common/Title';
import CategoryForm from '../tailwindCss/CategoryForm';
import { useNewCategory } from '../hooks/useNewCategory';

const NewCategory = () => {
    const { categoryName, setCategoryName, error, successMessage, saving, handleSave } = useNewCategory();
    return (
        <div className="relative min-h-screen flex flex-col items-center justify-center bg-white overflow-hidden">
            <Background />
            <Title />
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
    );
};
export default NewCategory;