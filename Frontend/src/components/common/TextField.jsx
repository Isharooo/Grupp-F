// src/common/TextField.jsx
import React from 'react';

// 1. Skapa klassuppsättningar för olika storlekar
const SIZE_MAP = {
    sm: 'w-44 text-sm',
    md: 'w-50 text-base py-1',
    lg: 'w-60 text-lg py-2',
};

const TextField = ({ id, type = 'text', placeholder, size = 'md' }) => {
    const sizeClasses = SIZE_MAP[size] || SIZE_MAP.md;

    return (
        <>
            <label htmlFor={id} className="sr-only">
                {placeholder}
            </label>
            <input
                id={id}
                type={type}
                placeholder={placeholder}
                className={`
          
          bg-transparent
          text-center italic
          placeholder:italic placeholder:text-slate-400
          border-0 border-b-4 border-orange-400
          drop-shadow-md
          focus:outline-none focus:border-orange-500
          ${sizeClasses}     // <-- storleksklasser här
        `}
            />
        </>
    );
};

export default TextField;
