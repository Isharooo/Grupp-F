import React from 'react';
import { FaBars } from 'react-icons/fa';
import headerLogo from '../images/HeaderLogo.png';
import ProductSearch from './ProductSearch';

/**
 * ProductsPageHeader component that renders the top section of the products page.
 * Includes a logo, a sidebar toggle button, and a product search input field.
 *
 * @param {Object} props - Component props
 * @param {string} props.searchQuery - The current search query
 * @param {Function} props.setSearchQuery - Function to update the search query
 * @param {Function} props.toggleSidebar - Function to toggle the sidebar visibility
 */
const ProductsPageHeader = ({ searchQuery, setSearchQuery, toggleSidebar }) => {
    return (
        <header className="bg-white w-full border-b border-gray-300 shadow-lg px-4 py-2">
            <div className="flex items-center justify-between max-w-6xl mx-auto">

                <button onClick={toggleSidebar} className="text-gray-600 text-xl mr-4">
                    <FaBars />
                </button>

                <img src={headerLogo} alt="GR FOOD AB ORDER" className="w-60 h-auto" />

                <div className="w-64">
                    <ProductSearch value={searchQuery} onChange={setSearchQuery} />
                </div>
            </div>
        </header>
    );
};

export default ProductsPageHeader;
