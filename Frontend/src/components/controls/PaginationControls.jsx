import React from 'react';

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
                    Show less
                </button>
            )}
        </div>
    );
};

export default PaginationControls;