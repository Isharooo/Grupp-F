import React from 'react';
import { FaTrash } from 'react-icons/fa';
import Header from '../components/common/Header';
import MyButton from '../components/common/Button';
import ProductTable from '../components/tables/ProductTable';
import SelectedProductsTable from '../components/tables/SelectedProductsTable';
import PaginationControls from '../components/controls/PaginationControls';
import CategoriesSidebar from '../components/common/CategoriesSidebar';
import { useProductsManagement } from '../hooks/useProductsManagement';

const ProductsPage = () => {
    const {
        categories,
        selectedCategory,
        setSelectedCategory,
        products,
        visibleCount,
        visibleSelectedCount,
        selectedItems,
        setSelectedItems,
        isLoading,
        error,
        searchQuery,
        setSearchQuery,
        isCategoryExpanded,
        currentPage,
        totalProducts,
        incrementQuantity,
        decrementQuantity,
        updateQuantityDirectly,
        changePrice,
        loadNextPage,
        loadPreviousPage,
        incrementSelectedVisible,
        decrementSelectedVisible,
        onSave,
        removeSelectedItem,
        getQuantity,
        toggleCategoryExpansion,
        PAGE_SIZE,
        SELECTED_PAGE_INCREMENT
    } = useProductsManagement();

    if (isLoading && products.length === 0) {
        return (
            <div className="flex flex-col min-h-screen bg-gray-50">
                <Header />
                <main className="flex-1 max-w-6xl mx-auto p-4 flex items-center justify-center">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
                        <p className="text-xl">Loading...</p>
                    </div>
                </main>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col min-h-screen bg-gray-50">
                <Header />
                <main className="flex-1 max-w-6xl mx-auto p-4 flex items-center justify-center">
                    <div className="text-red-600 text-center">
                        <p className="text-xl mb-4">{error}</p>
                        <MyButton label="Try Again" onClick={() => window.location.reload()} />
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen bg-white">
            {/* Main content */}
            <div className="max-w-6xl mx-auto w-full px-4 py-6">
                <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                    <div className="relative w-full md:w-64">
                        <input
                            type="text"
                            placeholder="Search products..."
                            className="w-full px-4 py-2 border rounded-lg"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                {/* Main content with sidebar and product list */}
                <div className="flex flex-col md:flex-row gap-6">
                    {/* Categories sidebar */}
                    <CategoriesSidebar
                        categories={categories}
                        selectedCategory={selectedCategory}
                        setSelectedCategory={setSelectedCategory}
                        isCategoryExpanded={isCategoryExpanded}
                        toggleCategoryExpansion={toggleCategoryExpansion}
                    />

                    {/* Product list section */}
                    <div className="flex-1 flex flex-col">
                        <h2 className="text-xl font-semibold text-center mb-4">All Products</h2>

                        {/* Loading overlay for products */}
                        {isLoading && products.length > 0 && (
                            <div className="relative">
                                <div className="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center z-10">
                                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                                </div>
                            </div>
                        )}

                        {/* Product table */}
                        <ProductTable
                            products={products}
                            getQuantity={getQuantity}
                            incrementQuantity={incrementQuantity}
                            decrementQuantity={decrementQuantity}
                            updateQuantityDirectly={updateQuantityDirectly}
                            changePrice={changePrice}
                            visibleCount={visibleCount}
                        />

                        {/* Pagination controls for products */}
                        <div className="flex justify-center gap-4 my-4">
                            {currentPage > 0 && (
                                <button
                                    className="text-blue-600 font-medium py-2"
                                    onClick={loadPreviousPage}
                                >
                                    Previous Page
                                </button>
                            )}

                            {(currentPage + 1) * PAGE_SIZE < totalProducts && (
                                <button
                                    className="text-blue-600 font-medium py-2"
                                    onClick={loadNextPage}
                                >
                                    Next Page
                                </button>
                            )}
                        </div>

                        {/* Selected items section */}
                        <SelectedProductsTable
                            selectedItems={selectedItems}
                            visibleSelectedCount={visibleSelectedCount}
                            decrementQuantity={decrementQuantity}
                            incrementQuantity={incrementQuantity}
                            updateQuantityDirectly={updateQuantityDirectly}
                            changePrice={changePrice}
                            removeItem={removeSelectedItem}
                        />

                        {/* Pagination controls for selected items */}
                        <PaginationControls
                            currentCount={visibleSelectedCount}
                            totalCount={selectedItems.length}
                            increment={incrementSelectedVisible}
                            decrement={decrementSelectedVisible}
                            pageSize={SELECTED_PAGE_INCREMENT}
                        />

                        {/* Bottom action buttons */}
                        <div className="flex justify-between mt-4">
                            <button
                                className="text-red-600"
                                onClick={() => {
                                    if (window.confirm('Are you sure you want to clear all selected products?')) {
                                        setSelectedItems([]);
                                    }
                                }}
                            >
                                <FaTrash size={20} />
                            </button>
                            <button
                                className={`${selectedItems.length === 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'} text-white px-6 py-2 rounded-lg`}
                                onClick={onSave}
                                disabled={selectedItems.length === 0}
                            >
                                Finish order
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductsPage;
