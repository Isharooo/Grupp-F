import React, { useState } from 'react';
import { FaEdit, FaTimes } from 'react-icons/fa';

const ProductTable = ({
                          products,
                          getQuantity,
                          incrementQuantity,
                          decrementQuantity,
                          updateQuantityDirectly,
                          changePrice,
                          visibleCount
                      }) => {
    const [enlargedImage, setEnlargedImage] = useState(null);

    const openEnlargedImage = (imageUrl, productName) => {
        setEnlargedImage({ url: imageUrl, name: productName });
    };

    const closeEnlargedImage = () => {
        setEnlargedImage(null);
    };

    if (!products || products.length === 0) {
        return (
            <div className="border rounded-lg overflow-hidden mb-6">
                <table className="w-full border-collapse">
                    <thead>
                    <tr className="bg-gray-50 border-b">
                        <th className="py-3 px-4 text-left font-medium border-r border-orange-200">Name</th>
                        <th className="py-3 px-4 text-left font-medium border-r border-orange-200">Art. nr</th>
                        <th className="py-3 px-4 text-left font-medium border-r border-orange-200">Weight</th>
                        <th className="py-3 px-4 text-left font-medium border-r border-orange-200">Price</th>
                        <th className="py-3 px-4 text-left font-medium border-r border-orange-200">Amount</th>
                        <th className="py-3 px-4 text-left font-medium">Picture</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td colSpan="6" className="py-6 text-center text-gray-500">
                            No products found
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>
        );
    }

    return (
        <div className="border rounded-lg overflow-hidden mb-6 relative">
            <table className="w-full border-collapse">
                <thead>
                <tr className="bg-gray-50 border-b-2">
                    <th className="py-3 px-4 text-left font-medium border-r-2 border-orange-200">Name</th>
                    <th className="py-3 px-4 text-left font-medium border-r-2 border-orange-200">Art. nr</th>
                    <th className="py-3 px-4 text-left font-medium border-r-2 border-orange-200">Weight</th>
                    <th className="py-3 px-4 text-left font-medium border-r-2 border-orange-200">Price</th>
                    <th className="py-3 px-4 text-left font-medium border-r-2 border-orange-200">Amount</th>
                    <th className="py-3 px-4 text-left font-medium">Picture</th>
                </tr>
                </thead>
                <tbody>
                {products.slice(0, visibleCount).map((product, index) => (
                    <tr key={product.id} className={`border-b-4 border-orange-200 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                        <td className="py-3 px-4 border-r-2 border-orange-200">{product.name}</td>
                        <td className="py-3 px-4 border-r-2 border-orange-200">{product.articleNumber || product.id}</td>
                        <td className="py-3 px-4 border-r-2 border-orange-200">{product.weight || '-'}</td>
                        <td className="py-3 px-4 border-r-2 border-orange-200">
                            <div>
                                {parseFloat(product.price).toFixed(2)}
                                {getQuantity(product.id) > 0 && (
                                    <button
                                        className="ml-2 text-blue-600"
                                        onClick={() => {
                                            const newPrice = prompt('Enter new price:', product.price);
                                            if (newPrice && !isNaN(newPrice)) {
                                                changePrice(product.id, newPrice);
                                            }
                                        }}
                                    >
                                        <FaEdit size={14} />
                                    </button>
                                )}
                            </div>
                        </td>
                        <td className="py-3 border-r-2 border-orange-200">
                            <div className="flex items-center justify-center">
                                <button
                                    className={`w-6 h-6 flex items-center justify-center ${getQuantity(product.id) > 0 ? 'bg-gray-200 hover:bg-gray-300' : 'text-gray-300'} rounded-full`}
                                    onClick={() => decrementQuantity(product)}
                                    disabled={getQuantity(product.id) === 0}
                                >
                                    -
                                </button>
                                <input
                                    type="text"
                                    className="mx-2 w-8 text-center border-b outline-none"
                                    value={getQuantity(product.id)}
                                    onChange={(e) => updateQuantityDirectly(product.id, e.target.value)}
                                />
                                <button
                                    className="w-6 h-6 flex items-center justify-center bg-blue-100 hover:bg-blue-200 rounded-full text-blue-800"
                                    onClick={() => incrementQuantity(product)}
                                >
                                    +
                                </button>
                            </div>
                        </td>
                        <td className="p-2 text-center">
                            {(product.imageUrl || product.image) ? (
                                <img
                                    src={product.imageUrl || product.image}
                                    alt={product.name}
                                    className="h-12 w-12 object-cover mx-auto cursor-pointer hover:opacity-80"
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = '/placeholder-image.png';
                                    }}
                                    onClick={() => openEnlargedImage(product.imageUrl || product.image, product.name)}
                                />
                            ) : (
                                <div className="h-12 w-12 bg-gray-200 flex items-center justify-center text-xs text-gray-500 mx-auto">
                                    No image
                                </div>
                            )}
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>

            {/* Enlarged Image Modal */}
            {enlargedImage && (
                <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50" onClick={closeEnlargedImage}>
                    <div className="bg-white p-4 rounded-lg max-w-2xl max-h-screen overflow-auto" onClick={e => e.stopPropagation()}>
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-medium">{enlargedImage.name}</h3>
                            <button onClick={closeEnlargedImage} className="text-gray-500 hover:text-gray-700">
                                <FaTimes size={24} />
                            </button>
                        </div>
                        <img
                            src={enlargedImage.url}
                            alt={enlargedImage.name}
                            className="max-w-full max-h-[70vh] object-contain mx-auto"
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = '/placeholder-image.png';
                            }}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductTable;
