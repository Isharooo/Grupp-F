import React from 'react';

const SIZE_MAP = {
    sm: 'w-44 text-sm',
    md: 'w-50 text-base py-1',
    lg: 'w-60 text-lg py-2',
};

/**
 * TextField component that renders a styled text input with optional size and placeholder.
 * Size is controlled via predefined Tailwind class mappings.
 *
 * @param {Object} props - Component props
 * @param {string} props.id - Unique ID for the input element (used for accessibility)
 * @param {string} [props.type='text'] - Type of input (e.g. text, email, number)
 * @param {string} props.placeholder - Placeholder text displayed in the input
 * @param {'sm'|'md'|'lg'} [props.size='md'] - Size of the input field
 */
const TextField = ({
                       id,
                       type = 'text',
                       placeholder,
                       size = 'md',
                       value,
                       onChange
                   }) => {
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
                value={value}
                onChange={onChange}
                className={`
                    bg-transparent
                    text-center italic
                    placeholder:italic placeholder:text-slate-400
                    border-0 border-b-4 border-orange-400
                    drop-shadow-md
                    focus:outline-none focus:border-orange-500
                    ${sizeClasses}
                `}
            />
        </>
    );
};


export default TextField;
