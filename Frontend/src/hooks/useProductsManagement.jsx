import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../services/api';

const PAGE_SIZE = 10;
const SELECTED_PAGE_INCREMENT = 5;

export const useProductsManagement = () => {
    const navigate = useNavigate();
    const { orderId } = useParams();

    // State
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

    // Ladda kategorier
    useEffect(() => {
        setIsLoading(true);
        api.getCategories()
            .then(res => setCategories(res.data))
            .catch(err => {
                setError('Failed to load categories');
            })
            .finally(() => setIsLoading(false));
    }, []);

    // Ladda produkter med pagination
    useEffect(() => {
        setIsLoading(true);
        const params = {
            page: currentPage,
            size: PAGE_SIZE,
            search: searchQuery || undefined,
            category: selectedCategory !== 'all' ? selectedCategory : undefined,
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

    // Om vi är i redigeringsläge (orderId finns): ladda orderItems och matcha med produkter
    useEffect(() => {
        if (!orderId) {
            setSelectedItems([]); // Ny order: töm valda produkter
            return;
        }
        setIsLoading(true);
        Promise.all([
            api.getOrderItems(orderId),
            api.getProductsPaginated({ size: 1000 }) // hämta alla produkter för lookup
        ])
            .then(([orderItemsRes, productsRes]) => {
                const orderItems = orderItemsRes.data;
                const allProducts = productsRes.data.content;
                // Koppla ihop orderItem och produktdata
                const items = orderItems.map(item => {
                    const prod = allProducts.find(p => p.id === item.productId) || {};
                    return {
                        productId: item.productId,
                        name: prod.name || '',
                        originalPrice: prod.price, // <-- produktens nuvarande pris
                        price: item.salePrice,     // <-- priset som användes i ordern
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

    // Lägg till produkt i order (skapa orderItem i backend direkt)
    const incrementQuantity = async (prod) => {
        const existing = selectedItems.find(i => i.productId === prod.id);
        if (existing) {
            // Öka quantity på existerande orderItem
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
            // Skapa nytt orderItem
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


    // Ta bort eller minska produkt (uppdatera eller ta bort orderItem i backend)
    const decrementQuantity = async (prod) => {
        // Hitta ALLA orderItems för denna produkt och order (ifall det finns dubbletter)
        const allExisting = selectedItems.filter(i => i.productId === prod.id);
        const existing = allExisting[0];
        if (!existing) return;

        // Om det finns fler än en: ta bort alla utom en i backend och frontend
        if (allExisting.length > 1) {
            await Promise.all(allExisting.slice(1).map(i => api.deleteOrderItem(i.orderItemId)));
            setSelectedItems(prev => prev.filter((i, idx) => i.productId !== prod.id || idx === prev.findIndex(x => x.productId === prod.id)));
        }

        if (existing.quantity > 1) {
            // Uppdatera quantity i backend
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
            // Ta bort orderItem i backend och frontend
            await api.deleteOrderItem(existing.orderItemId);
            setSelectedItems(prev => prev.filter(i => i.productId !== prod.id));
        }
    };

    // Ändra antal direkt
    const updateQuantityDirectly = async (prodId, newQuantity) => {
        const quantity = parseInt(newQuantity);
        const existing = selectedItems.find(i => i.productId === prodId);
        if (!existing) return;
        if (isNaN(quantity) || quantity <= 0) {
            await api.deleteOrderItem(existing.orderItemId);
            setSelectedItems(prev => prev.filter(i => i.productId !== prodId));
            return;
        }
        // Skicka endast de fält backend förväntar sig!
        await api.updateOrderItem(existing.orderItemId, {
            id: existing.orderItemId,
            orderId: Number(orderId),
            productId: existing.productId,
            quantity: quantity,
            salePrice: existing.price // eller existing.salePrice om du använder det namnet
        });
        setSelectedItems(prev =>
            prev.map(i =>
                i.productId === prodId
                    ? { ...i, quantity, totalPrice: i.price * quantity }
                    : i
            )
        );
    };

    // Ändra pris (uppdatera orderItem)
    const changePrice = async (prodId, newPrice) => {
        const parsedPrice = Number(newPrice);
        if (isNaN(parsedPrice) || parsedPrice <= 0) return;

        const existing = selectedItems.find(i => i.productId === prodId);
        if (!existing) return;

        // Skicka endast de fält som backend förväntar sig
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

    // Navigera till finish
    const onSave = () => {

        if (selectedItems.length === 0) {
            alert('Please add at least one product to the order');
            return;
        }

        // Spara valda produkter i localStorage för att användas i FinishOrder
        localStorage.setItem(`selectedItems_${orderId}`, JSON.stringify(selectedItems));

        // Navigera till slutförande-formuläret
        navigate(`/orders/${orderId}/finish`);
    };

    // Ta bort produkt helt (radera orderItem)
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

    // Pagination
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
