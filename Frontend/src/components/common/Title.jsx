import React from 'react';
import logo from '../images/GRfoodABOrderLogo.png';

/**
 * Title component that displays the GR FOOD AB ORDER logo centered on the page.
 * Typically used as a branding element at the top of a view.
 */
const Title = () => {
    return (
        <div className="flex flex-col items-center z-10">
            <img
                src={logo}
                alt="GR FOOD AB ORDER LOGO"
                className="w-80 h-auto"
            />
        </div>
    );
};

export default Title;