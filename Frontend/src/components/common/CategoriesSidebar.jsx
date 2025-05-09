import React, { useRef } from 'react';

const CategoriesSidebar = ({
                               categories,
                               selectedCategory,
                               setSelectedCategory,
                               isOpen,
                               onClose
                           }) => {
    const categoryListRef = useRef(null);

    return (
        <>
            {/* Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-30 z-30"
                    onClick={onClose}
                />
            )}

            {/* Slide-in sidomeny */}
            <div
                className={`
          fixed top-0 left-0 h-full w-64 bg-white shadow-xl z-40
          transform transition-transform duration-300
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
            >
                <div className="border-b font-medium px-4 py-3 bg-gray-50 flex justify-between items-center">
                    <span>Categories</span>
                    <button onClick={onClose} className="text-sm text-gray-500 hover:text-gray-800">
                        ✕
                    </button>
                </div>

                <div
                    ref={categoryListRef}
                    className="overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
                    style={{ maxHeight: 'calc(100vh - 60px)' }}
                >
                    <div
                        className={`px-4 py-3 cursor-pointer hover:bg-gray-100 ${selectedCategory === 'all' ? 'bg-blue-50 font-medium' : ''}`}
                        onClick={() => {
                            setSelectedCategory('all');
                            onClose();
                        }}
                    >
                        All Categories
                    </div>
                    {categories.map(category => (
                        <div
                            key={category.id}
                            className={`px-4 py-3 cursor-pointer hover:bg-gray-100 ${selectedCategory === category.id ? 'bg-blue-50 font-medium' : ''}`}
                            onClick={() => {
                                setSelectedCategory(category.id);
                                onClose();
                            }}
                        >
                            {category.name}
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};

export default CategoriesSidebar;
