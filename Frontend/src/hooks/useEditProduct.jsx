import { useState, useEffect } from 'react';
import api from '../services/api';

/**
 * Custom React hook for editing product data.
 * Manages form state, handles validation, save/delete operations, and keeps product and category lists in sync.
 *
 * @returns {Object} Object containing product data, category data, form state, and utility functions:
 *   - selectedProduct: The product currently selected for editing
 *   - setSelectedProduct: Setter for selectedProduct
 *   - searchValue, setSearchValue: Search input state
 *   - categoryId, setCategoryId: Product category ID field state
 *   - error: Error message (string)
 *   - successMessage: Success message (string)
 *   - saving: Boolean flag for ongoing save operation
 *   - deleting: Boolean flag for ongoing delete operation
 *   - handleSave: Function to validate and save the product
 *   - handleDelete: Function to delete the selected product
 */
export const useEditProduct = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [searchValue, setSearchValue] = useState('');
    const [productName, setProductName] = useState('');
    const [price, setPrice] = useState('');
    const [articleNumber, setArticleNumber] = useState('');
    const [imageURL, setImageURL] = useState('');
    const [weight, setWeight] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [visible, setVisible] = useState(true);


    useEffect(() => {
        api.getAllProducts().then(res => setProducts(res.data));
        api.getCategories().then(res => setCategories(res.data));
    }, []);

    useEffect(() => {
        if (!selectedProduct) {
            setProductName('');
            setPrice('');
            setArticleNumber('');
            setImageURL('');
            setWeight('');
            setCategoryId('');
            return;
        }
        setProductName(selectedProduct.name || '');
        setPrice(selectedProduct.price || '');
        setArticleNumber(selectedProduct.articleNumber || '');
        setImageURL(selectedProduct.image || '');
        setWeight(selectedProduct.weight || '');
        setCategoryId(selectedProduct.categoryId ? String(selectedProduct.categoryId) : '');
        setVisible(selectedProduct.visible ?? true);
    }, [selectedProduct]);

    const handleSave = async () => {
        if (!selectedProduct) {
            setError("Välj en produkt att redigera");
            return;
        }
        if (!productName.trim()) {
            setError("Product name is required");
            return;
        }
        if (!articleNumber) {
            setError("Article number is required");
            return;
        }
        if (!price) {
            setError("Price is required");
            return;
        }
        if (!categoryId) {
            setError("Category is required");
            return;
        }
        setSaving(true);
        setError('');
        try {
            const productData = {
                name: productName.trim(),
                price: parseFloat(price) || 0,
                articleNumber: parseInt(articleNumber) || null,
                image: imageURL.trim() === "" ? null : imageURL.trim(),
                weight: weight.trim() === "" ? null : weight.trim(),
                categoryId: parseInt(categoryId),
                visible: visible,
            };
            await api.updateProduct(selectedProduct.id, productData);
            setSuccessMessage("Product updated!");
            setTimeout(() => setSuccessMessage(''), 3000);
            const res = await api.getAllProducts();
            setProducts(res.data);
            setSelectedProduct({ ...selectedProduct, ...productData });
        } catch (err) {
            setError("Failed to update product. Please try again.");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!selectedProduct) {
            setError("Välj en produkt att ta bort");
            return;
        }
        if (!window.confirm("Vill du verkligen ta bort produkten?")) return;
        setDeleting(true);
        setError('');
        try {
            await api.deleteProduct(selectedProduct.id);
            setSuccessMessage("Product deleted!");
            setTimeout(() => setSuccessMessage(''), 3000);
            setProducts(products.filter(p => p.id !== selectedProduct.id));
            setSelectedProduct(null);
        } catch (err) {
            setError("Failed to delete product. It may be in use.");
        } finally {
            setDeleting(false);
        }
    };

    return {
        products,
        categories,
        selectedProduct,
        setSelectedProduct,
        searchValue,
        setSearchValue,
        productName,
        setProductName,
        price,
        setPrice,
        articleNumber,
        setArticleNumber,
        imageURL,
        setImageURL,
        weight,
        setWeight,
        categoryId,
        setCategoryId,
        error,
        successMessage,
        saving,
        deleting,
        handleSave,
        handleDelete,
        visible,
        setVisible
    };
};
