import React from 'react';

const Background = () => {
    return (
        <>
            <div className="absolute -left-10 top-1/2 -translate-y-1/2 w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 bg-blue-100 rounded-full -translate-x-1/3 z-0"></div>
            <div className="absolute -top-8 right-0 w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 bg-orange-100 rounded-full translate-x-1/3 -translate-y-1/3 z-0"></div>
            <div className="absolute bottom-8 right-16 w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 bg-green-100 rounded-full translate-x-1/3 translate-y-1/3 z-0"></div>
        </>
    );
};

export default Background;
