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
        api.getOrderItems(orderId)
            .then(res => {
                const items = res.data;
                api.getProductsPaginated({ size: 1000 })
                    .then(prodRes => {
                        const allProducts = prodRes.data.content;
                        const mapped = items.map(item => {
                            const prod = allProducts.find(p => p.id === item.productId) || {};
                            return {
                                productId: item.productId,
                                name: prod.name || '',
                                originalPrice: prod.price || item.salePrice,
                                price: item.salePrice,
                                totalPrice: item.salePrice * item.quantity,
                                quantity: item.quantity,
                                articleNumber: prod.articleNumber || '',
                                weight: prod.weight || '',
                                imageUrl: prod.image || '',
                                orderItemId: item.id
                            };
                        });
                        setSelectedItems(mapped);
                    });
            });
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
            navigate('/');
        } catch (err) {
            setError('Failed to save order. Please try again.');
        } finally {
            setIsSaving(false);
        }
    };

    const handleDownloadPdf = async () => {
        try {
            const res = await api.downloadOrderPdf(orderId, { responseType: 'arraybuffer' });

            const header = res.headers['content-disposition'] || '';
            let fileName = (header.match(/filename=\"?([^\";]+)\"?/) || [])[1];

            if (!fileName) {
                const customer = companyName.trim()
                    .normalize('NFD')
                    .replace(/[^\x00-\x7F]/g, '')
                    .replace(/[^a-zA-Z0-9]+/g, '_')
                    .replace(/^_|_$/g, '')
                    .toLowerCase();
                const today = new Date().toISOString().slice(0, 10);
                fileName = `order_${customer}_${today}.pdf`;
            }

            const blob = new Blob([res.data], { type: 'application/pdf' });
            const url  = window.URL.createObjectURL(blob);

            const link = document.createElement('a');
            link.href = url;
            link.download = fileName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (err) {
            setError('Failed to download PDF.');
        }
    };


    return {
        order, selectedItems, companyName, setCompanyName, sendDate, setSendDate,
        isLoading, error, isSaving, handleSave, handleDownloadPdf
    };
}
