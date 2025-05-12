import React, { useEffect, useState } from 'react';
import api from '../../services/api';

/**
 * CategoryDropdown component that fetches and displays a list of categories in a styled select menu.
 * On initial render, it loads categories from the backend using the provided API service.
 *
 * This dropdown is read-only and does not currently emit any selected value.
 */
const CategoryDropdown = () => {
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        api.getCategories()
            .then((res) => setCategories(res.data))
            .catch((err) => console.error("Kunde inte hämta kategorier", err));
    }, []);

    return (
        <div className="relative w-44">
            <select
                className="w-full px-4 py-1
                   border-2 border-orange-400
                   italic font-semibold text-slate-400
                   rounded-none appearance-none
                   bg-white
                   focus:outline-none"
                defaultValue=""
            >
                <option disabled value="">Categories</option>
                {categories.map((cat, i) => (
                    <option key={i} value={cat.id ?? cat.name}>
                        {cat.name?.replace(/\r/g, '')}
                    </option>
                ))}
            </select>

            <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                <svg
                    className="w-5 h-5 text-slate-400"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
            </div>
        </div>
    );
};

export default CategoryDropdown;
