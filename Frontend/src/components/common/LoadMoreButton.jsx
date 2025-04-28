import React from 'react';

const LoadMoreButton = ({ onClick, hasMore, loading }) => {
    if (!hasMore) return null;

    return (
        <div className="flex justify-center my-4">
            <button
                onClick={onClick}
                disabled={loading}
                className="px-4 py-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 disabled:opacity-50 shadow-md transition-colors"
            >
                {loading ? 'Laddar...' : 'Visa fler'}
            </button>
        </div>
    );
};

export default LoadMoreButton;
