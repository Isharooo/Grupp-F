import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../services/api';

const PAGE_SIZE = 10;
const SELECTED_PAGE_INCREMENT = 5;

export const useProductsManagement = () => {
    const navigate = useNavigate();
    const { orderId } = useParams();

    // State variables
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [products, setProducts] = useState([]);
    const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
    const [visibleSelectedCount, setVisibleSelectedCount] = useState(SELECTED_PAGE_INCREMENT);
    const [selectedItems, setSelectedItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [isCategoryExpanded, setIsCategoryExpanded] = useState(true);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalProducts, setTotalProducts] = useState(0);

    // Load categories
    useEffect(() => {
        setIsLoading(true);
        api.getCategories()
            .then(res => setCategories(res.data))
            .catch(err => {
                console.error('Error loading categories:', err);
                setError('Failed to load categories');
            })
            .finally(() => setIsLoading(false));
    }, []);

    // Load products with pagination
    useEffect(() => {
        setIsLoading(true);

        // Build query parameters
        const params = {
            page: currentPage,
            size: PAGE_SIZE,
            search: searchQuery || undefined,
            category: selectedCategory !== 'all' ? selectedCategory : undefined,
        };

        // New API method for paginated products
        api.getProductsPaginated(params)
            .then(res => {
                setProducts(res.data.content);
                setTotalProducts(res.data.totalElements);
                setVisibleCount(Math.min(PAGE_SIZE, res.data.content.length));
            })
            .catch(err => {
                console.error('Error loading products:', err);
                setError('Failed to load products');
            })
            .finally(() => setIsLoading(false));
    }, [currentPage, selectedCategory, searchQuery]);

    // Reset page when category or search changes
    useEffect(() => {
        setCurrentPage(0);
    }, [selectedCategory, searchQuery]);

    // Handle quantity changes
    const incrementQuantity = (prod) => {
        setSelectedItems(prev => {
            const exists = prev.find(i => i.productId === prod.id);
            if (exists) {
                return prev.map(i =>
                    i.productId === prod.id
                        ? {
                            ...i,
                            quantity: i.quantity + 1,
                            totalPrice: (i.price * (i.quantity + 1))
                        }
                        : i
                );
            }
            return [...prev, {
                productId: prod.id,
                name: prod.name,
                originalPrice: parseFloat(prod.price),
                price: parseFloat(prod.price),
                totalPrice: parseFloat(prod.price),
                quantity: 1,
                articleNumber: prod.articleNumber || '',
                weight: prod.weight || '',
                imageUrl: prod.imageUrl || ''
            }];
        });
    };

    const decrementQuantity = (prod) => {
        setSelectedItems(prev => {
            const exists = prev.find(i => i.productId === prod.id);
            if (exists && exists.quantity > 1) {
                return prev.map(i =>
                    i.productId === prod.id
                        ? {
                            ...i,
                            quantity: i.quantity - 1,
                            totalPrice: (i.price * (i.quantity - 1))
                        }
                        : i
                );
            } else if (exists) {
                return prev.filter(i => i.productId !== prod.id);
            }
            return prev;
        });
    };

    const updateQuantityDirectly = (prodId, newQuantity) => {
        const quantity = parseInt(newQuantity);
        if (isNaN(quantity) || quantity <= 0) {
            setSelectedItems(prev => prev.filter(i => i.productId !== prodId));
            return;
        }

        setSelectedItems(prev =>
            prev.map(i =>
                i.productId === prodId
                    ? {
                        ...i,
                        quantity,
                        totalPrice: (i.price * quantity)
                    }
                    : i
            )
        );
    };

    const changePrice = (prodId, newPrice) => {
        const parsedPrice = Number(newPrice);
        if (isNaN(parsedPrice) || parsedPrice <= 0) return;

        setSelectedItems(prev =>
            prev.map(i =>
                i.productId === prodId
                    ? {
                        ...i,
                        price: parsedPrice,
                        totalPrice: (parsedPrice * i.quantity),
                        priceChanged: true
                    }
                    : i
            )
        );
    };

    // Pagination controls
    const loadNextPage = () => {
        setCurrentPage(currentPage + 1);
    };

    const loadPreviousPage = () => {
        if (currentPage > 0) {
            setCurrentPage(currentPage - 1);
        }
    };

    const incrementSelectedVisible = () => {
        setVisibleSelectedCount(prev => prev + SELECTED_PAGE_INCREMENT);
    };

    const decrementSelectedVisible = () => {
        setVisibleSelectedCount(Math.max(SELECTED_PAGE_INCREMENT, visibleSelectedCount - SELECTED_PAGE_INCREMENT));
    };

    // Save order items to backend
    const onSave = () => {
        if (selectedItems.length === 0) {
            alert('Please add at least one product to the order');
            return;
        }

        // Spara valda produkter i localStorage för att användas i FinishOrderForm
        localStorage.setItem(`selectedItems_${orderId}`, JSON.stringify(selectedItems));

        // Navigera till slutförande-formuläret
        navigate(`/orders/${orderId}/finish`);
    };

    // Remove item from selected items
    const removeSelectedItem = (productId) => {
        setSelectedItems(prev => prev.filter(i => i.productId !== productId));
    };

    const getQuantity = (productId) => {
        const item = selectedItems.find(i => i.productId === productId);
        return item ? item.quantity : 0;
    };

    const toggleCategoryExpansion = () => {
        setIsCategoryExpanded(!isCategoryExpanded);
    };


    return {
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
        SELECTED_PAGE_INCREMENT,
        orderId
    };
};
