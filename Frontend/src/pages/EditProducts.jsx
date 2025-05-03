import React, { useEffect, useState } from 'react';
import Background from '../components/common/Background';
import Title from '../components/common/Title';
import MyButton from "../components/common/Button";
import { Link } from "react-router-dom";
import api from '../services/api';

const EditProducts = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedProductId, setSelectedProductId] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    // Form state
    const [productName, setProductName] = useState('');
    const [price, setPrice] = useState('');
    const [articleNumber, setArticleNumber] = useState('');
    const [imageURL, setImageURL] = useState('');
    const [weight, setWeight] = useState('');
    const [categoryId, setCategoryId] = useState('');

    // Fetch products and categories on load
    useEffect(() => {
        Promise.all([
            api.getAllProducts(),
            api.getCategories()
        ])
            .then(([productsRes, categoriesRes]) => {
                setProducts(productsRes.data);
                setFilteredProducts(productsRes.data);
                setCategories(categoriesRes.data);
            })
            .catch(err => {
                console.error("Failed to fetch data:", err);
                setError("Could not load products and categories");
            });
    }, []);

    // Filter products when search term changes
    useEffect(() => {
        if (!searchTerm.trim()) {
            setFilteredProducts(products);
            return;
        }
        const filtered = products.filter(p =>
            p.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredProducts(filtered);
    }, [searchTerm, products]);

    // Load selected product data
    useEffect(() => {
        if (!selectedProductId) {
            resetForm();
            return;
        }

        const product = products.find(p => p.id === parseInt(selectedProductId));
        if (product) {
            setProductName(product.name || '');
            setPrice(product.price || '');
            setArticleNumber(product.articleNumber || '');
            setImageURL(product.image || '');
            setWeight(product.weight || '');
            setCategoryId(product.categoryId ? product.categoryId.toString() : '');
        }
    }, [selectedProductId, products]);

    const resetForm = () => {
        setProductName('');
        setPrice('');
        setArticleNumber('');
        setImageURL('');
        setWeight('');
        setCategoryId('');
    };

    const handleSave = async () => {
        if (!selectedProductId) {
            setError("Please select a product");
            return;
        }

        if (!productName.trim()) {
            setError("Product name is required");
            return;
        }

        setIsSaving(true);
        setError('');
        try {
            const productData = {
                id: parseInt(selectedProductId),
                name: productName.trim(),
                price: parseFloat(price) || 0,
                articleNumber: parseInt(articleNumber) || null,
                image: imageURL.trim(),
                weight: weight.trim(),
                categoryId: parseInt(categoryId) || null
            };

            await api.updateProduct(selectedProductId, productData);

            // Refresh products list
            const productsRes = await api.getAllProducts();
            setProducts(productsRes.data);

            setSuccessMessage("Product updated successfully!");
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (err) {
            setError("Failed to update product. Please try again.");
            console.error(err);
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!selectedProductId) {
            setError("Please select a product to delete");
            return;
        }

        if (!window.confirm("Are you sure you want to delete this product?")) {
            return;
        }

        setIsDeleting(true);
        setError('');
        try {
            await api.deleteProduct(selectedProductId);

            // Remove product from list and reset form
            setProducts(prev => prev.filter(p => p.id !== parseInt(selectedProductId)));
            setSelectedProductId('');
            resetForm();

            setSuccessMessage("Product deleted successfully!");
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (err) {
            setError("Failed to delete product. It may be in use by orders.");
            console.error(err);
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className="relative min-h-screen flex flex-col items-center justify-center bg-white overflow-hidden">
            <Background />
            <Title />
            <div className="z-10 bg-white rounded-lg mt-8 w-full max-w-xl shadow-[0_0_8px_2px_rgba(251,146,60,0.3)] flex flex-col justify-center h-full">
                <div className="mt-8 text-center text-2xl text-[#166BB3] font-semibold">Edit Products</div>

                {/* Search products */}
                <div className="my-6 flex items-center justify-center">
                    <input
                        type="text"
                        placeholder="Search products..."
                        className="w-52 px-4 py-2 border rounded-lg"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                {/* Product selection dropdown */}
                <div className="mt-2 mb-4 flex items-center justify-center">
                    <div className="relative w-64">
                        <select
                            className="w-full px-4 py-1 border-2 border-orange-400 italic font-semibold text-slate-400 rounded-none appearance-none bg-white focus:outline-none"
                            value={selectedProductId}
                            onChange={(e) => setSelectedProductId(e.target.value)}
                        >
                            <option value="">Select product...</option>
                            {filteredProducts.map(p => (
                                <option key={p.id} value={p.id}>{p.name}</option>
                            ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                            <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>
                    </div>
                </div>

                {/* Product form */}
                <div className="mt-2 mb-4 flex items-center justify-center">
                    <div className="mr-10">
                        <input
                            type="text"
                            placeholder="Product Name"
                            className="w-44 text-base py-1 bg-transparent text-center italic placeholder:italic placeholder:text-slate-400 border-0 border-b-4 border-orange-400 focus:outline-none focus:border-orange-500"
                            value={productName}
                            onChange={(e) => setProductName(e.target.value)}
                            disabled={!selectedProductId}
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
                            disabled={!selectedProductId}
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
                            disabled={!selectedProductId}
                        />
                    </div>
                    <div className="ml-10">
                        <input
                            type="text"
                            placeholder="Image URL"
                            className="w-44 text-base py-1 bg-transparent text-center italic placeholder:italic placeholder:text-slate-400 border-0 border-b-4 border-orange-400 focus:outline-none focus:border-orange-500"
                            value={imageURL}
                            onChange={(e) => setImageURL(e.target.value)}
                            disabled={!selectedProductId}
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
                            disabled={!selectedProductId}
                        />
                    </div>
                    <div className="ml-10">
                        <div className="relative w-44">
                            <select
                                className="w-full px-4 py-1 border-2 border-orange-400 italic font-semibold text-slate-400 rounded-none appearance-none bg-white focus:outline-none"
                                value={categoryId}
                                onChange={(e) => setCategoryId(e.target.value)}
                                disabled={!selectedProductId}
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
                            <MyButton label="Back" size="sm"/>
                        </Link>
                    </div>
                    <div className="mx-6">
                        <MyButton
                            label={isDeleting ? "Deleting..." : "Delete"}
                            onClick={handleDelete}
                            disabled={isDeleting || !selectedProductId}
                            size="sm"
                        />
                    </div>
                    <div className="mx-6">
                        <MyButton
                            label={isSaving ? "Saving..." : "Save"}
                            onClick={handleSave}
                            disabled={isSaving || !selectedProductId}
                            size="sm"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditProducts;
