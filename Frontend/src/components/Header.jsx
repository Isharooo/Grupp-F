import React from 'react';

const Header = () => {
    return (
        <header className="bg-white w-full border-b border-gray-300 shadow-lg">
            <div className="flex flex-col items-center z-10">
                <h1 className="flex items-baseline text-2xl sm:text-3xl italic tracking-tight">
                    <span className="text-blue-600">GR</span>
                    <span className="ml-2 text-green-600">FOOD AB</span>
                </h1>
                <p className="text-1xl sm:text-2xl font-serif italic tracking-tight">
                    <span className="text-blue-600">OR</span>
                    <span className="text-green-600">DER</span>
                </p>
            </div>
        </header>
    );
};

export default Header;