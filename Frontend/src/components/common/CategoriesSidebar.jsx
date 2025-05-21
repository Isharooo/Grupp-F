import React, {useEffect, useRef, useState} from 'react';
import keycloak from '../../keycloak';

/**
 * Sidebar component that displays a list of categories in a slide-in panel.
 * Can be opened or closed, and allows users to select a category which triggers a callback.
 *
 * @param {Object} props - Component props
 * @param {Array} props.categories - List of category objects to display (each should have id and name)
 * @param {string|number} props.selectedCategory - Currently selected category ID or 'all'
 * @param {Function} props.setSelectedCategory - Callback for setting the selected category
 * @param {boolean} props.isOpen - Controls whether the sidebar is visible
 * @param {Function} props.onClose - Callback to close the sidebar
 */
const CategoriesSidebar = ({
                               categories,
                               selectedCategory,
                               setSelectedCategory,
                               isOpen,
                               onClose
                           }) => {

    const [isAdmin, setIsAdmin] = useState(false);
    const categoryListRef = useRef(null);

    useEffect(() => {
        const checkAdminRole = () => {
            if (keycloak.authenticated) {
                setIsAdmin(keycloak.hasRealmRole('admin'));
            }
        };

        checkAdminRole();
    }, []);

    // Först filtrera kategorierna baserat på admin-rollen
    const filteredCategories = categories.filter(category =>
        isAdmin || category.name.toLowerCase() !== "nocategory"
    );

    // Sedan sortera de filtrerade kategorierna
    const sortedAndFilteredCategories = [...filteredCategories].sort((a, b) => {
        if (a.name.toLowerCase() === "nocategory") return 1;
        if (b.name.toLowerCase() === "nocategory") return -1;
        return a.orderIndex - b.orderIndex || a.name.localeCompare(b.name);
    });

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
                    {sortedAndFilteredCategories.map(category => (
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
