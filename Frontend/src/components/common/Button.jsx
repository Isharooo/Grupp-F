import React from 'react';

const MyButton = ({ label, onClick, disabled }) => {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className="
        shadow-[0_0_8px_2px_rgba(0,0,0,0.15)]
        bg-transparent
        border-2 border-orange-400
        text-[#166BB3]
        font-medium
        px-4 py-2
        rounded

        hover:bg-orange-400
        hover:text-white
        transition-colors
        disabled:cursor-not-allowed
        disabled:opacity-50
      "
        >
            {label}
        </button>
    );
};

export default MyButton;
