import { useState, useEffect } from 'react';
import api from '../services/api';

/**
 * Custom React hook for creating a new product.
 * Manages form state, category loading, article number validation, and product submission to backend.
 *
 * @returns {Object} Object containing form state, category list, and handlers:
 *   - categories: List of categories available for product assignment
 *   - visible: Boolean flag for whether the product is visible
 *   - error: Error message (string)
 *   - successMessage: Success message (string)
 *   - isSaving: Boolean indicating if save operation is in progress
 *   - handleSave: Function to validate and save the new product
 */
export const useNewProduct = () => {
    const [categories, setCategories] = useState([]);
    const [productName, setProductName] = useState('');
    const [price, setPrice] = useState('');
    const [articleNumber, setArticleNumber] = useState('');
    const [imageURL, setImageURL] = useState('');
    const [weight, setWeight] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [visible] = useState(true);

    useEffect(() => {
        api.getCategories()
            .then((res) => setCategories(res.data))
            .catch((err) => {
                console.error("Could not fetch categories", err);
                setError("Failed to load categories");
            });
    }, []);


    const resetForm = () => {
        setProductName('');
        setPrice('');
        setArticleNumber('');
        setImageURL('');
        setWeight('');
        setCategoryId('');
    };

    const handleSave = async () => {
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

        setIsSaving(true);
        setError('');

        try {
            const res = await api.checkArticleNumber(articleNumber);
            if (res.data.exists) {
                setError("A product with this article number already exists.");
                setIsSaving(false);
                return;
            }
        } catch (err) {
            setError("Could not validate article number. Try again.");
            setIsSaving(false);
            return;
        }

        try {
            const productData = {
                name: productName.trim(),
                articleNumber: Number(articleNumber),
                price: Number(price),
                categoryId: Number(categoryId),
                image: imageURL.trim() === '' ? null : imageURL.trim(),
                weight: weight.trim() === '' ? null : weight.trim(),
                visible: visible,
            };

            await api.addProduct(productData);
            setSuccessMessage("Product created successfully!");
            resetForm();
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to save product. Please try again.");
        } finally {
            setIsSaving(false);
        }
    };

    return {
        categories,
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
        isSaving,
        handleSave
    };
};
