import React, { useEffect, useState } from 'react';
import Background from '../components/common/Background';
import Title from '../components/common/Title';
import MyButton from "../components/common/Button";
import { Link } from "react-router-dom";
import api from '../services/api';

const EditCategories = () => {
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
            setTimeout(() => setSuccessMessage(''), 3000); // Dölj efter 3 sekunder
        } catch (e) {
            setError("Failed to delete category. It may be in use.");
        } finally {
            setDeleting(false);
        }
    };

    return (
        <div className="relative min-h-screen flex flex-col items-center justify-center bg-white overflow-hidden">
            <Background />
            <Title />
            <div className="z-10 bg-white rounded-lg mt-8 w-full max-w-xl shadow-[0_0_8px_2px_rgba(251,146,60,0.3)] flex flex-col justify-center h-full">
                <div className="mt-8 text-center text-2xl text-[#166BB3] font-semibold">Edit Category</div>
                <div className="mt-8 flex items-center justify-center">
                    <div className="relative w-44">
                        <select
                            className="w-full px-4 py-1 border-2 border-orange-400 italic font-semibold text-slate-400 rounded-none appearance-none bg-white focus:outline-none"
                            value={selectedId}
                            onChange={e => setSelectedId(e.target.value)}
                        >
                            <option value="">Select category...</option>
                            {categories.map(cat => (
                                <option key={cat.id} value={cat.id}>
                                    {cat.name?.replace(/\r/g, '')}
                                </option>
                            ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                            <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>
                    </div>
                </div>
                <div className="my-8 flex items-center justify-center">
                    <input
                        type="text"
                        placeholder="Category Name"
                        className="w-60 text-lg py-2 border-b-4 border-orange-400 text-center italic placeholder:italic placeholder:text-slate-400 bg-transparent focus:outline-none focus:border-orange-500"
                        value={categoryName}
                        onChange={e => setCategoryName(e.target.value)}
                        disabled={!selectedId}
                    />
                </div>
                {error && <div className="text-red-600 text-center mb-4">{error}</div>}
                <div className="my-10 flex items-center justify-center">
                    <div className="mx-6">
                        <Link to="/AdminSettings">
                            <MyButton label="Back" size="sm" />
                        </Link>
                    </div>
                    <div className="mx-6">
                        <MyButton label={deleting ? "Deleting..." : "Delete"} onClick={handleDelete} disabled={deleting || !selectedId} size="sm" />
                    </div>
                    <div className="mx-6">
                        <MyButton label={saving ? "Saving..." : "Save"} onClick={handleSave} disabled={saving || !selectedId} size="sm" />
                    </div>
                </div>
                {successMessage && (
                    <div className="text-green-600 text-center mb-4 transition-all duration-300">{successMessage}</div>
                )}
            </div>
        </div>
    );
};

export default EditCategories;
