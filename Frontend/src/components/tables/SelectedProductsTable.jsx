import React from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';

const SelectedProductsTable = ({
                                   selectedItems,
                                   visibleSelectedCount,
                                   decrementQuantity,
                                   incrementQuantity,
                                   updateQuantityDirectly,
                                   changePrice,
                                   removeItem
                               }) => {
    if (!selectedItems || selectedItems.length === 0) {
        return null;
    }

    const totalOrderValue = selectedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2);
    const visibleItems = selectedItems.slice(0, visibleSelectedCount);

    return (
        <div className="bg-white border rounded-lg shadow overflow-hidden mb-6">
            <h3 className="bg-gray-50 border-b px-4 py-3 font-medium">Selected Products</h3>
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                    <tr className="bg-gray-50 border-b">
                        <th className="py-3 px-4 text-left font-medium border-r border-orange-200">Name</th>
                        <th className="py-3 px-4 text-left font-medium border-r border-orange-200">Art. nr</th>
                        <th className="py-3 px-4 text-left font-medium border-r border-orange-200">Weight</th>
                        <th className="py-3 px-4 text-left font-medium border-r border-orange-200">Price</th>
                        <th className="py-3 px-4 text-left font-medium border-r border-orange-200">Quantity</th>
                        <th className="py-3 px-4 text-left font-medium border-r border-orange-200">Total</th>
                        <th className="py-3 px-4 text-left font-medium">Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {visibleItems.map((item, index) => (
                        <tr key={item.productId} className={`border-b ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                            <td className="py-3 px-4 border-r border-orange-200">{item.name}</td>
                            <td className="py-3 px-4 border-r border-orange-200">{item.articleNumber || '-'}</td>
                            <td className="py-3 px-4 border-r border-orange-200">{item.weight || '-'}</td>
                            <td className="py-3 px-4 border-r border-orange-200">
                                <div className="flex items-center">
                                    {item.price !== item.originalPrice && (
                                        <span className="line-through text-red-500 mr-2">{item.originalPrice?.toFixed(2)}</span>
                                    )}
                                    <span>{item.price.toFixed(2)}</span>
                                    <button
                                        className="ml-2 text-blue-600"
                                        onClick={() => {
                                            const newPrice = prompt('Enter new price:', item.price);
                                            if (newPrice && !isNaN(newPrice)) {
                                                changePrice(item.productId, newPrice);
                                            }
                                        }}
                                    >
                                        <FaEdit size={14} />
                                    </button>
                                </div>
                            </td>
                            <td className="py-3 px-4 border-r border-orange-200">
                                <div className="flex items-center">
                                    <button
                                        className="w-6 h-6 flex items-center justify-center bg-gray-200 hover:bg-gray-300 rounded-full"
                                        onClick={() => decrementQuantity({id: item.productId})}
                                    >
                                        -
                                    </button>
                                    <input
                                        type="text"
                                        className="mx-2 w-8 text-center border-b outline-none"
                                        value={item.quantity}
                                        onChange={(e) => updateQuantityDirectly(item.productId, e.target.value)}
                                    />
                                    <button
                                        className="w-6 h-6 flex items-center justify-center bg-blue-100 hover:bg-blue-200 rounded-full text-blue-800"
                                        onClick={() => incrementQuantity({id: item.productId})}
                                    >
                                        +
                                    </button>
                                </div>
                            </td>
                            <td className="py-3 px-4 border-r border-orange-200 font-medium">
                                {(item.price * item.quantity).toFixed(2)}
                            </td>
                            <td className="py-3 px-4">
                                <button
                                    className="text-red-600 hover:text-red-800"
                                    onClick={() => removeItem(item.productId)}
                                >
                                    <FaTrash size={16} />
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                    <tfoot>
                    <tr className="bg-gray-50 border-t">
                        <td colSpan="5" className="py-3 px-4 text-right font-semibold">Total Order Value:</td>
                        <td className="py-3 px-4 font-semibold border-r border-orange-200">
                            {totalOrderValue}
                        </td>
                        <td></td>
                    </tr>
                    </tfoot>
                </table>
            </div>
        </div>
    );
};

export default SelectedProductsTable;
