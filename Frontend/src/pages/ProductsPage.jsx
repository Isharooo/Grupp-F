import React, { useEffect } from 'react';
import { FaTrash } from 'react-icons/fa';
import MyButton from '../components/common/Button';
import ProductTable from '../components/tables/ProductTable';
import SelectedProductsTable from '../components/tables/SelectedProductsTable';
import PaginationControls from '../hooks/PaginationControls';
import CategoriesSidebar from '../components/common/CategoriesSidebar';
import ProductsPageHeader from '../components/common/ProductsPageHeader';
import { useProductsManagement } from '../hooks/useProductsManagement';
import { useNavigate } from 'react-router-dom';
import api from "../services/api";

const ProductsPage = () => {
    const navigate = useNavigate();

    const {
        orderId,
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

    useEffect(() => {
        document.body.style.overflow = isCategoryExpanded ? 'hidden' : 'auto';
    }, [isCategoryExpanded]);

    if (isLoading && products.length === 0) {
        return (
            <div className="flex flex-col min-h-screen bg-gray-50">
                <ProductsPageHeader />
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
                <ProductsPageHeader />
                <main className="flex-1 max-w-6xl mx-auto p-4 flex items-center justify-center">
                    <div className="text-red-600 text-center">
                        <p className="text-xl mb-4">{error}</p>
                        <MyButton label="Try Again" onClick={() => window.location.reload()} />
                    </div>
                </main>
            </div>
        );
    }


    const handleDeleteOrder = async () => {
        if (window.confirm('Are you sure you want to delete this order?')) {
            try {
                await api.deleteOrder(orderId);
                setSelectedItems([]);
                navigate('/orders');
            } catch (err) {
                alert('Failed to delete order. Please try again.');
            }
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-white">
            <ProductsPageHeader
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                toggleSidebar={toggleCategoryExpansion}
            />

            <CategoriesSidebar
                categories={categories}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                isOpen={isCategoryExpanded}
                onClose={toggleCategoryExpansion}
            />

            <div className="max-w-6xl mx-auto w-full px-4 py-6">
                <div className="flex-1 flex flex-col">
                    <div className="my-4 text-center text-2xl text-[#166BB3] font-semibold">New Order</div>

                    {isLoading && products.length > 0 && (
                        <div className="relative">
                            <div className="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center z-10">
                                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                            </div>
                        </div>
                    )}

                    <ProductTable
                        products={products}
                        getQuantity={getQuantity}
                        incrementQuantity={incrementQuantity}
                        decrementQuantity={decrementQuantity}
                        updateQuantityDirectly={updateQuantityDirectly}
                        changePrice={changePrice}
                        visibleCount={visibleCount}
                    />

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

                    <SelectedProductsTable
                        selectedItems={selectedItems}
                        visibleSelectedCount={visibleSelectedCount}
                        decrementQuantity={decrementQuantity}
                        incrementQuantity={incrementQuantity}
                        updateQuantityDirectly={updateQuantityDirectly}
                        changePrice={changePrice}
                        removeItem={removeSelectedItem}
                    />

                    <PaginationControls
                        currentCount={visibleSelectedCount}
                        totalCount={selectedItems.length}
                        increment={incrementSelectedVisible}
                        decrement={decrementSelectedVisible}
                        pageSize={SELECTED_PAGE_INCREMENT}
                    />

                    <div className="flex justify-between mt-4">
                        <button
                            className="text-red-600"
                            onClick={handleDeleteOrder}
                        >
                            <FaTrash size={20} />
                        </button>
                        <MyButton label="Finish order" onClick={onSave} disabled={selectedItems.length === 0}/>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductsPage;
