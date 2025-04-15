import React from 'react';

const Background = () => {
    return (
        <>
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-48 h-48 sm:w-64 sm:h-64 md:w-80 md:h-80 bg-blue-100 rounded-full -translate-x-1/3 z-0"></div>
            <div className="absolute top-0 right-0 w-48 h-48 sm:w-64 sm:h-64 md:w-80 md:h-80 bg-orange-100 rounded-full translate-x-1/3 -translate-y-1/3 z-0"></div>
            <div className="absolute bottom-0 right-0 w-48 h-48 sm:w-64 sm:h-64 md:w-80 md:h-80 bg-green-100 rounded-full translate-x-1/3 translate-y-1/3 z-0"></div>
        </>
    );
};

export default Background;
