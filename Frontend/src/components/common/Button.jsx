import React from 'react';

const SIZE_MAP = {
    sm: 'w-28 h-10 text-sm',
    md: 'w-40 h-12 text-base',
    lg: 'w-44 h-20 text-lg',
};

/**
 * Reusable button component
 *
 * @param {string}   label      – Texten på knappen
 * @param {'sm'|'md'|'lg'} size – Storlek (default 'md')
 * @param {string}   className  – Extra Tailwind‑klasser om du vill skräddarsy
 * @param {object}   rest       – Alla andra props, t.ex. onClick
 */
const MyButton = ({ label, size = 'md', className = '', ...rest }) => {
    const sizeClasses = SIZE_MAP[size] || SIZE_MAP.md;

    return (
        <button
            {...rest}
            className={`
                shadow-[0_0_8px_2px_rgba(0,0,0,0.15)] bg-transparent
                border-2 border-orange-400 rounded-lg
                text-[#166BB3] font-semibold
                
                hover:bg-orange-400
                hover:text-white
                transition-colors
                
                disabled:cursor-not-allowed
                disabled:opacity-50
                ${sizeClasses} ${className}`}
        >
            {label}
        </button>
    );
};

export default MyButton;
