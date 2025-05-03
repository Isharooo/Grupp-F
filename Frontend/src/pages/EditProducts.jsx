import React, { useEffect, useState } from 'react';
import Background from '../components/common/Background';
import Title from '../components/common/Title';
import MyButton from "../components/common/Button";
import { Link } from "react-router-dom";
import api from '../services/api';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import MuiTextField from '@mui/material/TextField';

const filterOptions = createFilterOptions({
    ignoreCase: true,
    limit: 5,
    stringify: (option) => `${option.name} ${option.articleNumber}`,
});

const EditProducts = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [searchValue, setSearchValue] = useState('');
    const [productName, setProductName] = useState('');
    const [price, setPrice] = useState('');
    const [articleNumber, setArticleNumber] = useState('');
    const [imageURL, setImageURL] = useState('');
    const [weight, setWeight] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        api.getAllProducts().then(res => setProducts(res.data));
        api.getCategories().then(res => setCategories(res.data));
    }, []);

    // När produkt väljs, fyll i fälten
    useEffect(() => {
        if (!selectedProduct) {
            setProductName('');
            setPrice('');
            setArticleNumber('');
            setImageURL('');
            setWeight('');
            setCategoryId('');
            return;
        }
        setProductName(selectedProduct.name || '');
        setPrice(selectedProduct.price || '');
        setArticleNumber(selectedProduct.articleNumber || '');
        setImageURL(selectedProduct.image || '');
        setWeight(selectedProduct.weight || '');
        setCategoryId(selectedProduct.categoryId ? String(selectedProduct.categoryId) : '');
    }, [selectedProduct]);

    const handleSave = async () => {
        if (!selectedProduct) {
            setError("Välj en produkt att redigera");
            return;
        }
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
        setSaving(true);
        setError('');
        try {
            const productData = {
                name: productName.trim(),
                price: parseFloat(price) || 0,
                articleNumber: parseInt(articleNumber) || null,
                image: imageURL.trim() === "" ? null : imageURL.trim(),
                weight: weight.trim() === "" ? null : weight.trim(),
                categoryId: parseInt(categoryId),
            };
            await api.updateProduct(selectedProduct.id, productData);
            setSuccessMessage("Product updated!");
            setTimeout(() => setSuccessMessage(''), 3000);
            // Uppdatera produktlistan
            const res = await api.getAllProducts();
            setProducts(res.data);
            // Uppdatera selectedProduct med nya värden
            setSelectedProduct({ ...selectedProduct, ...productData });
        } catch (err) {
            setError("Failed to update product. Please try again.");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!selectedProduct) {
            setError("Välj en produkt att ta bort");
            return;
        }
        if (!window.confirm("Vill du verkligen ta bort produkten?")) return;
        setDeleting(true);
        setError('');
        try {
            await api.deleteProduct(selectedProduct.id);
            setSuccessMessage("Product deleted!");
            setTimeout(() => setSuccessMessage(''), 3000);
            setProducts(products.filter(p => p.id !== selectedProduct.id));
            setSelectedProduct(null);
        } catch (err) {
            setError("Failed to delete product. It may be in use.");
        } finally {
            setDeleting(false);
        }
    };

    return (
        <div className="relative min-h-screen flex flex-col items-center justify-center bg-white overflow-hidden">
            <Background />
            <Title />
            <div className="z-10 bg-white rounded-lg mt-8 w-full max-w-xl shadow-[0_0_8px_2px_rgba(251,146,60,0.3)] flex flex-col justify-center h-full">
                <div className="mt-8 text-center text-2xl text-[#166BB3] font-semibold">Edit Products</div>
                <div className="my-6 flex items-center justify-center">
                    <Autocomplete
                        id="product-search"
                        options={products}
                        filterOptions={filterOptions}
                        getOptionLabel={option =>
                            option && (option.name || option.articleNumber)
                                ? `${option.name} (${option.articleNumber ?? '-'})`
                                : ''
                        }
                        value={selectedProduct}
                        inputValue={searchValue}
                        onInputChange={(_, newInputValue) => setSearchValue(newInputValue)}
                        onChange={(_, value) => setSelectedProduct(value)}
                        renderInput={(params) => (
                            <MuiTextField
                                {...params}
                                label="Sök produkt (namn eller artikelnummer)"
                                variant="outlined"
                                style={{ width: 400 }} // <-- Gör rutan bredare (t.ex. 400px)
                            />
                        )}
                        isOptionEqualToValue={(option, value) => option.id === value.id}
                        noOptionsText="Ingen produkt funnen"
                    />
                </div>
                <div className="mt-2 mb-4 flex items-center justify-center">
                    <div className="mr-10">
                        <input
                            type="text"
                            placeholder="Product Name"
                            className="w-44 text-base py-1 bg-transparent text-center italic placeholder:italic placeholder:text-slate-400 border-0 border-b-4 border-orange-400 focus:outline-none focus:border-orange-500"
                            value={productName}
                            onChange={e => setProductName(e.target.value)}
                            disabled={!selectedProduct}
                        />
                    </div>
                    <div className="ml-10">
                        <input
                            type="number"
                            step="0.01"
                            placeholder="Price"
                            className="w-44 text-base py-1 bg-transparent text-center italic placeholder:italic placeholder:text-slate-400 border-0 border-b-4 border-orange-400 focus:outline-none focus:border-orange-500"
                            value={price}
                            onChange={e => setPrice(e.target.value)}
                            disabled={!selectedProduct}
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
                            onChange={e => setArticleNumber(e.target.value)}
                            disabled={!selectedProduct}
                        />
                    </div>
                    <div className="ml-10">
                        <input
                            type="text"
                            placeholder="Image URL"
                            className="w-44 text-base py-1 bg-transparent text-center italic placeholder:italic placeholder:text-slate-400 border-0 border-b-4 border-orange-400 focus:outline-none focus:border-orange-500"
                            value={imageURL}
                            onChange={e => setImageURL(e.target.value)}
                            disabled={!selectedProduct}
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
                            onChange={e => setWeight(e.target.value)}
                            disabled={!selectedProduct}
                        />
                    </div>
                    <div className="ml-10">
                        <div className="relative w-44">
                            <select
                                className="w-full px-4 py-1 border-2 border-orange-400 italic font-semibold text-slate-400 rounded-none appearance-none bg-white focus:outline-none"
                                value={categoryId}
                                onChange={e => setCategoryId(e.target.value)}
                                disabled={!selectedProduct}
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
                        <MyButton label={deleting ? "Deleting..." : "Delete"} onClick={handleDelete} disabled={deleting || !selectedProduct} size="sm" />
                    </div>
                    <div className="mx-6">
                        <MyButton label={saving ? "Saving..." : "Save"} onClick={handleSave} disabled={saving || !selectedProduct} size="sm" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditProducts;
