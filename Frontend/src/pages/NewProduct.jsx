import React, { useEffect, useState } from 'react';
import Background from '../components/common/Background';
import Title from '../components/common/Title';
import MyButton from "../components/common/Button";
import { Link } from "react-router-dom";
import api from '../services/api';

const NewProduct = () => {
    const [categories, setCategories] = useState([]);
    const [productName, setProductName] = useState('');
    const [price, setPrice] = useState('');
    const [articleNumber, setArticleNumber] = useState('');
    const [imageURL, setImageURL] = useState('');
    const [weight, setWeight] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        api.getCategories()
            .then((res) => setCategories(res.data))
            .catch((err) => {
                console.error("Could not fetch categories", err);
                setError("Failed to load categories");
            });
    }, []);

    const resetForm = () => {
        setProductName('');
        setPrice('');
        setArticleNumber('');
        setImageURL('');
        setWeight('');
        setCategoryId('');
    };

    const handleSave = async () => {
        if (!productName.trim()) {
            setError("Product name is required");
            return;
        }
        if (!articleNumber) {
            setError("Article number is required");
            return;
        }
        if (!price) {
            setError("Price is required");
            return;
        }
        if (!categoryId) {
            setError("Category is required");
            return;
        }

        setIsSaving(true);
        setError('');
        try {
            const productData = {
                name: productName.trim(),
                articleNumber: Number(articleNumber),
                price: Number(price),
                categoryId: Number(categoryId),
                image: imageURL.trim() === '' ? null : imageURL.trim(),
                weight: weight.trim() === '' ? null : weight.trim()
            };

            await api.addProduct(productData);
            setSuccessMessage("Product created successfully!");
            resetForm();
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (err) {
            console.error("Failed to save product:", err);
            setError(err.response?.data?.message || "Failed to save product. Please try again.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="relative min-h-screen flex flex-col items-center justify-center bg-white overflow-hidden">
            <Background />
            <Title />
            <div className="z-10 bg-white rounded-lg mt-8 w-full max-w-xl shadow-[0_0_8px_2px_rgba(251,146,60,0.3)] flex flex-col justify-center h-full">
                <div className="mt-8 text-center text-2xl text-[#166BB3] font-semibold">New Product</div>

                <div className="my-4 flex items-center justify-center">
                    <div className="mr-10">
                        <input
                            type="text"
                            placeholder="Product Name"
                            className="w-44 text-base py-1 bg-transparent text-center italic placeholder:italic placeholder:text-slate-400 border-0 border-b-4 border-orange-400 focus:outline-none focus:border-orange-500"
                            value={productName}
                            onChange={(e) => setProductName(e.target.value)}
                        />
                    </div>
                    <div className="ml-10">
                        <input
                            type="number"
                            step="0.01"
                            placeholder="Price"
                            className="w-44 text-base py-1 bg-transparent text-center italic placeholder:italic placeholder:text-slate-400 border-0 border-b-4 border-orange-400 focus:outline-none focus:border-orange-500"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                        />
                    </div>
                </div>

                <div className="my-10 flex items-center justify-center">
                    <div className="mr-10">
                        <input
                            type="number"
                            placeholder="Article Number"
                            className="w-44 text-base py-1 bg-transparent text-center italic placeholder:italic placeholder:text-slate-400 border-0 border-b-4 border-orange-400 focus:outline-none focus:border-orange-500"
                            value={articleNumber}
                            onChange={(e) => setArticleNumber(e.target.value)}
                        />
                    </div>
                    <div className="ml-10">
                        <input
                            type="text"
                            placeholder="Image URL"
                            className="w-44 text-base py-1 bg-transparent text-center italic placeholder:italic placeholder:text-slate-400 border-0 border-b-4 border-orange-400 focus:outline-none focus:border-orange-500"
                            value={imageURL}
                            onChange={(e) => setImageURL(e.target.value)}
                        />
                    </div>
                </div>

                <div className="my-6 flex items-center justify-center">
                    <div className="mr-10">
                        <input
                            type="text"
                            placeholder="Weight"
                            className="w-44 text-base py-1 bg-transparent text-center italic placeholder:italic placeholder:text-slate-400 border-0 border-b-4 border-orange-400 focus:outline-none focus:border-orange-500"
                            value={weight}
                            onChange={(e) => setWeight(e.target.value)}
                        />
                    </div>
                    <div className="ml-10">
                        <div className="relative w-44">
                            <select
                                className="w-full px-4 py-1 border-2 border-orange-400 italic font-semibold text-slate-400 rounded-none appearance-none bg-white focus:outline-none"
                                value={categoryId}
                                onChange={(e) => setCategoryId(e.target.value)}
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
                </div>

                {error && <div className="text-red-600 text-center mb-4">{error}</div>}
                {successMessage && <div className="text-green-600 text-center mb-4">{successMessage}</div>}

                <div className="my-10 flex items-center justify-center">
                    <div className="mx-6">
                        <Link to="/AdminSettings">
                            <MyButton label="Back" />
                        </Link>
                    </div>
                    <div className="mx-6">
                        <MyButton
                            label={isSaving ? "Saving..." : "Save"}
                            onClick={handleSave}
                            disabled={isSaving}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NewProduct;
