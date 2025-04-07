import React from 'react';

const Title = () => {
    return (
        <div className="flex flex-col items-center z-10">
            <h1 className="flex items-baseline text-4xl sm:text-5xl italic font-semibold tracking-tight">
                <span className="text-blue-600">GR</span>
                <span className="ml-2 text-green-600">FOOD AB</span>
            </h1>
            <hr className="w-48 sm:w-60 border-t-2 border-orange-400 my-1" />
            <p className="text-4xl sm:text-5xl italic font-semibold tracking-tight">
                <span className="text-blue-600">OR</span>
                <span className="text-green-600">DER</span>
            </p>
        </div>
    );
};

export default Title;
