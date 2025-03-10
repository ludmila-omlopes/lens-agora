import React, { forwardRef } from 'react';

type RetroButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
};

export const RetroButton = forwardRef<HTMLButtonElement, RetroButtonProps>(
  ({ children, onClick, type = 'button', className = '' }, ref) => {
    return (
      <button
        ref={ref}
        onClick={onClick}
        type={type}
        className={`bg-retroPrimary text-retroText shadow-retro border-2 border-retroBorder px-4 py-2 rounded-retro hover:bg-retroHover transition-all ${className}`}
      >
        {children}
      </button>
    );
  }
);

RetroButton.displayName = 'RetroButton';
