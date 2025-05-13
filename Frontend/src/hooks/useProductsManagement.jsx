import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../services/api';

const PAGE_SIZE = 10;
const SELECTED_PAGE_INCREMENT = 5;

/**
 * Custom React hook for managing product selection and manipulation when creating or editing an order.
 * Handles loading products and categories, pagination, quantity changes, price updates, and submitting the order.
 *
 * @returns {Object} Object containing state and utility functions:
 *   - categories, selectedCategory, setSelectedCategory: Category data and selection state
 *   - products: List of currently loaded products
 *   - visibleCount: Number of visible products
 *   - visibleSelectedCount: Number of visible selected products
 *   - selectedItems, setSelectedItems: Selected products for the order
 *   - isLoading: Boolean flag indicating loading state
 *   - error: Error message string
 *   - searchQuery, setSearchQuery: Search input state and setter
 *   - isCategoryExpanded: Boolean for toggling category menu UI
 *   - currentPage, totalProducts: Pagination state
 *   - incrementQuantity, decrementQuantity: Handlers for increasing/decreasing product quantity
 *   - updateQuantityDirectly: Handler for manual quantity entry
 *   - changePrice: Handler for updating the price of a selected product
 *   - loadNextPage, loadPreviousPage: Pagination controls
 *   - incrementSelectedVisible, decrementSelectedVisible: Controls for showing more/less selected products
 *   - onSave: Finalizes product selection and navigates to the finish order page
 *   - removeSelectedItem: Removes a product from the selection
 *   - getQuantity: Gets the quantity of a specific product
 *   - toggleCategoryExpansion: Toggles the sidebar/category view
 *   - PAGE_SIZE, SELECTED_PAGE_INCREMENT: Constants for default pagination
 *   - orderId: ID of the order being edited or created
 */
export const useProductsManagement = () => {
    const navigate = useNavigate();
    const { orderId } = useParams();

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

    useEffect(() => {
        setIsLoading(true);
        api.getCategories()
            .then(res => setCategories(res.data))
            .catch(err => {
                setError('Failed to load categories');
            })
            .finally(() => setIsLoading(false));
    }, []);

    useEffect(() => {
        setIsLoading(true);
        const params = {
            page: currentPage,
            size: PAGE_SIZE,
            search: searchQuery || undefined,
            category: selectedCategory !== 'all' ? selectedCategory : undefined,
            visible: true,
        };
        api.getProductsPaginated(params)
            .then(res => {
                setProducts(res.data.content);
                setTotalProducts(res.data.totalElements);
                setVisibleCount(Math.min(PAGE_SIZE, res.data.content.length));
            })
            .catch(err => {
                setError('Failed to load products');
            })
            .finally(() => setIsLoading(false));
    }, [currentPage, selectedCategory, searchQuery]);

    useEffect(() => {
        if (!orderId) {
            setSelectedItems([]);
            return;
        }
        setIsLoading(true);
        Promise.all([
            api.getOrderItems(orderId),
            api.getAllProducts()
        ])
            .then(([orderItemsRes, productsRes]) => {
                const orderItems = orderItemsRes.data;
                const allProducts = productsRes.data;
                const items = orderItems.map(item => {
                    const prod = allProducts.find(p => p.id === item.productId) || {};
                    return {
                        productId: item.productId,
                        name: prod.name || '',
                        originalPrice: prod.price,
                        price: item.salePrice,
                        totalPrice: item.salePrice * item.quantity,
                        quantity: item.quantity,
                        articleNumber: prod.articleNumber || '',
                        weight: prod.weight || '',
                        imageUrl: prod.image || '',
                        orderItemId: item.id
                    };
                });
                setSelectedItems(items);
            })
            .catch(() => setSelectedItems([]))
            .finally(() => setIsLoading(false));
    }, [orderId]);

    const incrementQuantity = async (prod) => {
        const existing = selectedItems.find(i => i.productId === prod.id);
        if (existing) {
            const newQuantity = existing.quantity + 1;
            await api.updateOrderItem(existing.orderItemId, {
                id: existing.orderItemId,
                orderId: Number(orderId),
                productId: prod.id,
                quantity: newQuantity,
                salePrice: existing.price
            });
            setSelectedItems(prev => prev.map(i =>
                i.productId === prod.id
                    ? { ...i, quantity: newQuantity, totalPrice: i.price * newQuantity }
                    : i
            ));
        } else {
            const res = await api.addOrderItem({
                orderId: Number(orderId),
                productId: prod.id,
                quantity: 1,
                salePrice: prod.price
            });
            setSelectedItems(prev => [
                ...prev,
                {
                    productId: prod.id,
                    name: prod.name,
                    originalPrice: parseFloat(prod.price),
                    price: parseFloat(prod.price),
                    totalPrice: parseFloat(prod.price),
                    quantity: 1,
                    articleNumber: prod.articleNumber || '',
                    weight: prod.weight || '',
                    imageUrl: prod.image || '',
                    orderItemId: res.data.id
                }
            ]);
        }
    };


    const decrementQuantity = async (prod) => {
        const allExisting = selectedItems.filter(i => i.productId === prod.id);
        const existing = allExisting[0];
        if (!existing) return;

        if (allExisting.length > 1) {
            await Promise.all(allExisting.slice(1).map(i => api.deleteOrderItem(i.orderItemId)));
            setSelectedItems(prev => prev.filter((i, idx) => i.productId !== prod.id || idx === prev.findIndex(x => x.productId === prod.id)));
        }

        if (existing.quantity > 1) {
            await api.updateOrderItem(existing.orderItemId, {
                id: existing.orderItemId,
                orderId: Number(orderId),
                productId: existing.productId,
                quantity: existing.quantity - 1,
                salePrice: existing.price
            });
            setSelectedItems(prev => prev.map(i =>
                i.productId === prod.id
                    ? { ...i, quantity: i.quantity - 1, totalPrice: i.price * (i.quantity - 1) }
                    : i
            ));
        } else {
            await api.deleteOrderItem(existing.orderItemId);
            setSelectedItems(prev => prev.filter(i => i.productId !== prod.id));
        }
    };

    const updateQuantityDirectly = async (prodId, newQuantity) => {
        const quantity = parseInt(newQuantity);
        const prod = products.find(p => p.id === prodId);
        const existing = selectedItems.find(i => i.productId === prodId);
        if (!prod) return;

        if (isNaN(quantity) || quantity <= 0) {
            if (existing) {
                await api.deleteOrderItem(existing.orderItemId);
                setSelectedItems(prev => prev.filter(i => i.productId !== prodId));
            }
            return;
        }

        if (existing) {
            await api.updateOrderItem(existing.orderItemId, {
                id: existing.orderItemId,
                orderId: Number(orderId),
                productId: prodId,
                quantity,
                salePrice: existing.price
            });
            setSelectedItems(prev =>
                prev.map(i =>
                    i.productId === prodId
                        ? { ...i, quantity, totalPrice: i.price * quantity }
                        : i
                )
            );
        } else {
            const res = await api.addOrderItem({
                orderId: Number(orderId),
                productId: prodId,
                quantity,
                salePrice: prod.price
            });
            setSelectedItems(prev => [
                ...prev,
                {
                    productId: prod.id,
                    name: prod.name,
                    originalPrice: parseFloat(prod.price),
                    price: parseFloat(prod.price),
                    totalPrice: parseFloat(prod.price) * quantity,
                    quantity,
                    articleNumber: prod.articleNumber || '',
                    weight: prod.weight || '',
                    imageUrl: prod.image || '',
                    orderItemId: res.data.id
                }
            ]);
        }
    };

    const changePrice = async (prodId, newPrice) => {
        const parsedPrice = Number(newPrice);
        if (isNaN(parsedPrice) || parsedPrice <= 0) return;

        const existing = selectedItems.find(i => i.productId === prodId);
        if (!existing) return;

        await api.updateOrderItem(existing.orderItemId, {
            id: existing.orderItemId,
            orderId: Number(orderId),
            productId: existing.productId,
            quantity: existing.quantity,
            salePrice: parsedPrice
        });

        setSelectedItems(prev =>
            prev.map(i =>
                i.productId === prodId
                    ? { ...i, price: parsedPrice, totalPrice: parsedPrice * i.quantity, priceChanged: true }
                    : i
            )
        );
    };

    const onSave = () => {

        if (selectedItems.length === 0) {
            alert('Please add at least one product to the order');
            return;
        }

        localStorage.setItem(`selectedItems_${orderId}`, JSON.stringify(selectedItems));

        navigate(`/orders/${orderId}/finish`);
    };

    const removeSelectedItem = async (productId) => {
        const existing = selectedItems.find(i => i.productId === productId);
        if (existing) {
            await api.deleteOrderItem(existing.orderItemId);
            setSelectedItems(prev => prev.filter(i => i.productId !== productId));
        }
    };

    const getQuantity = (productId) => {
        const item = selectedItems.find(i => i.productId === productId);
        return item ? item.quantity : 0;
    };

    const toggleCategoryExpansion = () => {
        setIsCategoryExpanded(!isCategoryExpanded);
    };

    const loadNextPage = () => setCurrentPage(currentPage + 1);
    const loadPreviousPage = () => setCurrentPage(currentPage > 0 ? currentPage - 1 : 0);
    const incrementSelectedVisible = () => setVisibleSelectedCount(prev => prev + SELECTED_PAGE_INCREMENT);
    const decrementSelectedVisible = () => setVisibleSelectedCount(Math.max(SELECTED_PAGE_INCREMENT, visibleSelectedCount - SELECTED_PAGE_INCREMENT));

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
