import React from 'react';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  ...props 
}) => {
  const baseStyles = 'font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variants = {
    primary: 'bg-brand-primary text-white hover:bg-purple-500 focus:ring-purple-400',
    secondary: 'bg-background-tertiary text-foreground-primary hover:bg-opacity-80 focus:ring-border-strong',
    outline: 'border-2 border-border text-foreground-primary hover:border-border-strong hover:bg-background-tertiary focus:ring-border-strong',
    ghost: 'text-foreground-primary hover:bg-background-tertiary focus:ring-border-strong',
  };
  
  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };
  
  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;

