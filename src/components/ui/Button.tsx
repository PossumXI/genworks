import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', loading, icon, children, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50';
    
    const variants = {
      primary: 'bg-purple-600 text-white hover:bg-purple-700 focus-visible:ring-purple-500',
      secondary: 'bg-purple-100 text-purple-900 hover:bg-purple-200 focus-visible:ring-purple-500',
      outline: 'border border-purple-200 bg-transparent hover:bg-purple-100 focus-visible:ring-purple-500',
      ghost: 'hover:bg-purple-100 hover:text-purple-900 focus-visible:ring-purple-500',
    };

    const sizes = {
      sm: 'h-8 px-3 text-sm',
      md: 'h-10 px-4',
      lg: 'h-12 px-6 text-lg',
    };

    return (
      <button
        ref={ref}
        className={twMerge(
          clsx(
            baseStyles,
            variants[variant],
            sizes[size],
            loading && 'relative text-transparent transition-none hover:text-transparent',
            className
          )
        )}
        disabled={loading}
        {...props}
      >
        {loading && (
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
          </div>
        )}
        {icon && <span className="mr-2">{icon}</span>}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';