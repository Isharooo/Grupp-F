import React, { useState } from 'react';
import Background from '../components/common/Background';
import Title from '../components/common/Title';
import MyButton from "../components/common/Button";
import { Link } from "react-router-dom";
import api from '../services/api';

const NewCategory = () => {
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
            setTimeout(() => setSuccessMessage(''), 3000); // Dölj efter 3 sekunder
        } catch (e) {
            setError("Failed to save category. Please try again.");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="relative min-h-screen flex flex-col items-center justify-center bg-white overflow-hidden">
            <Background />
            <Title />
            <div className="z-10 bg-white rounded-lg mt-8 w-full max-w-xl shadow-[0_0_8px_2px_rgba(251,146,60,0.3)] flex flex-col justify-center h-full">
                <div className="mt-8 text-center text-2xl text-[#166BB3] font-semibold">New Category</div>
                <div className="my-10 flex items-center justify-center w-full">
                    <input
                        type="text"
                        placeholder="Category Name"
                        className="w-60 text-lg py-2 border-b-4 border-orange-400 text-center italic placeholder:italic placeholder:text-slate-400 bg-transparent focus:outline-none focus:border-orange-500"
                        value={categoryName}
                        onChange={e => setCategoryName(e.target.value)}
                    />
                </div>
                {error && <div className="text-red-600 text-center mb-4">{error}</div>}
                {successMessage && (
                    <div className="text-green-600 text-center mb-4 transition-all duration-300">{successMessage}</div>
                )}
                <div className="my-10 flex items-center justify-center">
                    <div className="mx-6">
                        <Link to="/AdminSettings">
                            <MyButton label="Back" />
                        </Link>
                    </div>
                    <div className="mx-6">
                        <MyButton label={saving ? "Saving..." : "Save"} onClick={handleSave} disabled={saving} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NewCategory;
