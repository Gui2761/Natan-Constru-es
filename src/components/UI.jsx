import React from 'react';
import { twMerge } from 'tailwind-merge';
import { clsx } from 'clsx';

export const Button = ({ className, variant = 'primary', size = 'md', children, ...props }) => {
  const variants = {
    primary: 'bg-primary text-white hover:bg-primary/90 shadow-blueprint',
    secondary: 'bg-secondary text-white hover:bg-secondary/90',
    outline: 'border-2 border-primary text-primary hover:bg-primary/5',
    ghost: 'text-primary hover:bg-primary/5',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-6 py-2.5',
    lg: 'px-8 py-4 text-lg font-bold',
  };

  return (
    <button
      className={twMerge(
        'inline-flex items-center justify-center rounded-xl transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};

export const Input = ({ label, error, className, ...props }) => {
  return (
    <div className="w-full space-y-1.5">
      {label && <label className="text-sm font-medium text-on-surface/80 ml-1">{label}</label>}
      <input
        className={twMerge(
          'w-full px-4 py-3 bg-surface-container border border-outline-variant rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all',
          error && 'border-error ring-error/20',
          className
        )}
        {...props}
      />
      {error && <span className="text-xs text-error ml-1">{error}</span>}
    </div>
  );
};

export const Card = ({ children, className, hover = false }) => {
  return (
    <div className={twMerge(
      'bg-surface rounded-3xl border border-outline-variant shadow-blueprint p-6',
      hover && 'hover:shadow-lg transition-shadow cursor-pointer',
      className
    )}>
      {children}
    </div>
  );
};
