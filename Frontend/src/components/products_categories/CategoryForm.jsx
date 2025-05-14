import React from "react";
import MyButton from "../common/Button";
import { Link } from "react-router-dom";

const CategoryForm = ({
                          title,
                          categoryName,
                          setCategoryName,
                          error,
                          successMessage,
                          saving,
                          handleSave,
                          returnLink,
                          disabled = false,
                          showDelete = false,
                          handleDelete,
                          deleting = false,
                          categories,
                          selectedId,
                          setSelectedId
                      }) => (
    <div className="z-10 bg-white rounded-lg my-8 w-full max-w-xl shadow-[0_0_8px_2px_rgba(251,146,60,0.3)] flex flex-col justify-center h-full">
        {title && (
            <div className="mt-8 text-center text-2xl text-[#166BB3] font-semibold">{title}</div>
        )}

        {categories && setSelectedId && (
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
        )}

        <div className="my-8 flex items-center justify-center">
            <input
                type="text"
                placeholder="Category Name"
                className="w-60 text-lg py-2 border-b-4 border-orange-400 text-center italic placeholder:italic placeholder:text-slate-400 bg-transparent focus:outline-none focus:border-orange-500"
                value={categoryName}
                onChange={e => setCategoryName(e.target.value)}
                disabled={disabled}
            />
        </div>

        {error && <div className="text-red-600 text-center mb-4">{error}</div>}

        <div className="my-10 flex items-center justify-center">
            <div className="mx-6">
                <Link to={returnLink}>
                    <MyButton label="Back" size="sm" />
                </Link>
            </div>
            {showDelete && (
                <div className="mx-6">
                    <MyButton label={deleting ? "Deleting..." : "Delete"} onClick={handleDelete} disabled={deleting || !selectedId} size="sm" />
                </div>
            )}
            <div className="mx-6">
                <MyButton label={saving ? "Saving..." : "Save"} onClick={handleSave} disabled={saving || (showDelete && !selectedId)} size="sm" />
            </div>
        </div>
        {successMessage && (
            <div className="text-green-600 text-center mb-4 transition-all duration-300">{successMessage}</div>
        )}
    </div>
);

export default CategoryForm;
