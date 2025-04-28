import React, { useRef } from 'react';

const CategoriesSidebar = ({
                               categories,
                               selectedCategory,
                               setSelectedCategory,
                               isCategoryExpanded,
                               toggleCategoryExpansion
                           }) => {
    const categoryListRef = useRef(null);

    return (
        <div className="w-full md:w-64 flex-shrink-0 mb-4 md:mb-0">
            <div className="bg-white border rounded-lg shadow overflow-hidden">
                <div
                    className="bg-gray-50 px-4 py-3 border-b font-medium cursor-pointer flex justify-between items-center"
                    onClick={toggleCategoryExpansion}
                >
                    <span>Categories</span>
                    <span>{isCategoryExpanded ? '▼' : '►'}</span>
                </div>
                {isCategoryExpanded && (
                    <div
                        ref={categoryListRef}
                        className="overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
                        style={{ maxHeight: "400px" }}
                    >
                        <div
                            className={`px-4 py-3 cursor-pointer hover:bg-gray-100 ${selectedCategory === 'all' ? 'bg-blue-50 font-medium' : ''}`}
                            onClick={() => setSelectedCategory('all')}
                        >
                            All Categories
                        </div>
                        {categories.map(category => (
                            <div
                                key={category.id}
                                className={`px-4 py-3 cursor-pointer hover:bg-gray-100 ${selectedCategory === category.id ? 'bg-blue-50 font-medium' : ''}`}
                                onClick={() => setSelectedCategory(category.id)}
                            >
                                {category.name}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CategoriesSidebar;