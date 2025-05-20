import React from 'react';
import { Link } from "react-router-dom";
import MyButton from "../components/common/Button";

const ProductForm = ({
                         productName,
                         setProductName,
                         price,
                         setPrice,
                         articleNumber,
                         setArticleNumber,
                         imageURL,
                         setImageURL,
                         weight,
                         setWeight,
                         categoryId,
                         setCategoryId,
                         categories,
                         error,
                         successMessage,
                         isSaving,
                         handleSave,
                         returnLink,
                         title,
                         visible,
                         setVisible,
                         handleDelete,
                         deleting,
                         selectedProduct,
                         disabled = false
                     }) => {
    return (
        <>
            <div className="mt-8 text-center text-2xl text-[#166BB3] font-semibold">{title}</div>

            <div className="my-4 flex items-center justify-center">
                <div className="mr-10">
                    <input
                        type="text"
                        placeholder="Product Name"
                        className="w-44 text-base py-1 bg-transparent text-center italic placeholder:italic placeholder:text-slate-400 border-0 border-b-4 border-orange-400 focus:outline-none focus:border-orange-500"
                        value={productName}
                        onChange={(e) => setProductName(e.target.value)}
                        disabled={disabled}
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
                        disabled={disabled}
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
                        disabled={disabled}
                    />
                </div>
                <div className="ml-10">
                    <input
                        type="text"
                        placeholder="Image URL"
                        className="w-44 text-base py-1 bg-transparent text-center italic placeholder:italic placeholder:text-slate-400 border-0 border-b-4 border-orange-400 focus:outline-none focus:border-orange-500"
                        value={imageURL}
                        onChange={(e) => setImageURL(e.target.value)}
                        disabled={disabled}
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
                        disabled={disabled}
                    />
                </div>
                <div className="ml-10">
                    <div className="relative w-44">
                        <select
                            className="w-full px-4 py-1 border-2 border-orange-400 italic font-semibold text-slate-400 rounded-none appearance-none bg-white focus:outline-none"
                            value={categoryId}
                            onChange={(e) => setCategoryId(e.target.value)}
                            disabled={disabled}
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

            <div className="my-5 flex items-center justify-center text-[#166BB3]">
                <label className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        checked={visible}
                        onChange={e => setVisible(e.target.checked)}
                        disabled={disabled}
                        className="w-4 h-4"
                    />
                    Visible
                </label>
            </div>

            <div className="my-5 flex items-center justify-center">
                <div className="mx-6">
                    <Link to={returnLink}>
                        <MyButton label="Back" size="sm" />
                    </Link>
                </div>
                <div className="mx-6">
                    <MyButton
                        label={deleting ? "Deleting..." : "Delete"}
                        onClick={handleDelete}
                        disabled={deleting || !selectedProduct}
                        size="sm"
                    />
                </div>
                <div className="mx-6">
                    <MyButton
                        label={isSaving ? "Saving..." : "Save"}
                        onClick={handleSave}
                        disabled={isSaving || disabled}
                        size="sm"
                    />
                </div>
            </div>
        </>
    );
};

export default ProductForm;