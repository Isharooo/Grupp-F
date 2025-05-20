import React from 'react';

/**
 * PaginationControls component that shows "Load more" and "Show fewer" buttons based on pagination state.
 * Allows the user to control how many items are visible on the screen.
 *
 * @param {Object} props - Component props
 * @param {number} props.currentCount - Number of items currently displayed
 * @param {number} props.totalCount - Total number of items available
 * @param {Function} props.increment - Function to increase the number of visible items
 * @param {Function} props.decrement - Function to decrease the number of visible items
 * @param {number} props.pageSize - Default number of items per page
 */
const PaginationControls = ({
                                currentCount,
                                totalCount,
                                increment,
                                decrement,
                                pageSize
                            }) => {
    if (totalCount <= pageSize) {
        return null;
    }

    return (
        <div className="flex justify-center gap-4 my-4">
            {currentCount < totalCount && (
                <button
                    className="text-blue-600 font-medium py-2"
                    onClick={() => increment()}
                >
                    Load more
                </button>
            )}

            {currentCount > pageSize && (
                <button
                    className="text-blue-600 font-medium py-2"
                    onClick={() => decrement()}
                >
                    Show fewer
                </button>
            )}
        </div>
    );
};

export default PaginationControls;