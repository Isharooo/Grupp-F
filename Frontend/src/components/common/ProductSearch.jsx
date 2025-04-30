import React from 'react';

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
