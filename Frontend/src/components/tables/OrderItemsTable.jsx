import React from 'react';

/**
 * OrderItemsTable component that displays a table of order items including
 * product name, article number, price, quantity, and total price per item.
 * Also shows the total order value at the bottom.
 *
 * @param {Object} props - Component props
 * @param {Array} props.items - List of order items to display. Each item should have:
 *   - name: string
 *   - articleNumber: string | number
 *   - price: number
 *   - originalPrice: number (optional, for priceChanged)
 *   - quantity: number
 *   - priceChanged: boolean (if true, original price is shown as struck-through)
 */
const OrderItemsTable = ({ items }) => {
    const totalOrderValue = items.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2);

    return (
        <div className="border rounded-lg overflow-x-auto mb-6 relative">
            <table className="w-full border-collapse">
                <thead>
                <tr className="bg-gray-50 border-b-2">
                    <th className="py-3 px-4 text-left font-medium border-r-2 border-orange-200 text-[#166BB3]">Product</th>
                    <th className="py-3 px-4 text-left font-medium border-r-2 border-orange-200 text-[#166BB3]">Art. Nr</th>
                    <th className="py-3 px-4 text-left font-medium border-r-2 border-orange-200 text-[#166BB3]">Price</th>
                    <th className="py-3 px-4 text-left font-medium border-r-2 border-orange-200 text-[#166BB3]">Quantity</th>
                    <th className="py-3 px-4 text-left font-medium text-[#166BB3]">Total</th>
                </tr>
                </thead>
                <tbody>
                {items.map((item, idx) => (
                    <tr key={item.productId} className={`border-b-4 border-orange-200 ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                        <td className="py-3 px-4 border-r-2 border-orange-200">{item.name}</td>
                        <td className="py-3 px-4 border-r-2 border-orange-200">{item.articleNumber || '-'}</td>
                        <td className="py-3 px-4 border-r-2 border-orange-200">
                            {item.priceChanged ? (
                                <div>
                                    <span className="line-through text-red-500 mr-2">{item.originalPrice.toFixed(2)}</span>
                                    <span>{item.price.toFixed(2)}</span>
                                </div>
                            ) : (
                                item.price.toFixed(2)
                            )}
                        </td>
                        <td className="py-3 px-4 border-r border-orange-200">{item.quantity}</td>
                        <td className="py-3 px-4 font-medium">{(item.price * item.quantity).toFixed(2)}</td>
                    </tr>
                ))}
                </tbody>
                <tfoot>
                <tr className="bg-gray-50 border-t">
                    <td colSpan="4" className="py-3 px-4 text-right font-semibold">Total Order Value:</td>
                    <td className="py-3 px-4 font-semibold">{totalOrderValue}</td>
                </tr>
                </tfoot>
            </table>
        </div>
    );
};

export default OrderItemsTable;
