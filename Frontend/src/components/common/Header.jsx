import React from 'react';
import headerLogo from '../images/HeaderLogo.png';

/**
 * Header component that displays the logo at the top of the page.
 * Styled with a white background, border, and shadow.
 * Commonly used as a static top section across views.
 */
const Header = () => {
    return (
        <header className="bg-white w-full border-b border-gray-300 shadow-lg">
            <div className="flex flex-col items-center z-10">
                <img
                    src={headerLogo}
                    alt="GR FOOD AB ORDER"
                    className="w-80 h-auto"
                />
            </div>
        </header>
    );
};

export default Header;
