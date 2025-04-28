import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../services/api';

export default function useFinishOrder() {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [selectedItems, setSelectedItems] = useState([]);
    const [companyName, setCompanyName] = useState('');
    const [sendDate, setSendDate] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const response = await api.getOrderById(orderId);
                setOrder(response.data);
                setCompanyName(response.data.customerName || '');
                setSendDate(response.data.sendDate ? response.data.sendDate.slice(0, 10) : '');
            } catch (err) {
                setError('Failed to load order information');
            } finally {
                setIsLoading(false);
            }
        };
        fetchOrder();
    }, [orderId]);

    useEffect(() => {
        const items = localStorage.getItem(`selectedItems_${orderId}`);
        if (items) setSelectedItems(JSON.parse(items));
    }, [orderId]);

    const handleSave = async () => {
        if (!companyName.trim()) {
            setError('Company name is required');
            return;
        }
        setIsSaving(true);
        setError(null);
        try {
            await api.updateOrder(orderId, {
                customerName: companyName.trim(),
                sendDate: sendDate || null
            });
            const orderItems = selectedItems.map(item => ({
                orderId: Number(orderId),
                productId: item.productId,
                quantity: item.quantity,
                salePrice: item.price
            }));
            await Promise.all(orderItems.map(item => api.addOrderItem(item)));
            localStorage.removeItem(`selectedItems_${orderId}`);
            navigate('/orders');
        } catch (err) {
            setError('Failed to save order. Please try again.');
        } finally {
            setIsSaving(false);
        }
    };

    return {
        order, selectedItems, companyName, setCompanyName, sendDate, setSendDate,
        isLoading, error, isSaving, handleSave
    };
}
