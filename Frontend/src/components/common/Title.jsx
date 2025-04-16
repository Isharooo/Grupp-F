import React from 'react';
import logo from '../images/GRfoodABOrderLogo.png';

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