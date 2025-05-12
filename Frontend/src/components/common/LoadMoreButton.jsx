import React from 'react';

/**
 * LoadMoreButton component that renders a "Load more" button when more content is available.
 * The button is disabled while loading and hidden completely when there's nothing more to load.
 *
 * @param {Object} props - Component props
 * @param {Function} props.onClick - Callback function triggered when the button is clicked
 * @param {boolean} props.hasMore - Whether more items can be loaded
 * @param {boolean} props.loading - Whether a loading state is currently active
 */
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
