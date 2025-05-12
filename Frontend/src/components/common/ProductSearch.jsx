import React from 'react';

/**
 * ProductSearch component that renders a styled input field for searching products.
 * Accepts a value and a change handler from the parent to control the input.
 *
 * @param {Object} props - Component props
 * @param {string} props.value - Current value of the input field
 * @param {Function} props.onChange - Callback called with updated input value on change
 */
const ProductSearch = ({ value, onChange }) => {
    return (
        <div className="relative">
            <input
                type="text"
                placeholder="Search products..."
                className="w-full px-4 py-2 border rounded-lg"
                value={value}
                onChange={(e) => onChange(e.target.value)}
            />
        </div>
    );
};

export default ProductSearch;
