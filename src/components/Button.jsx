import React from 'react';

const DANGEROUS_PROPS = ['dangerouslySetInnerHTML', 'suppressContentEditableWarning', 'suppressHydrationWarning'];

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  ...props
}) => {
  const safeProps = { ...props };
  DANGEROUS_PROPS.forEach((key) => delete safeProps[key]);

  const baseStyles = 'font-medium rounded-[0.625rem] transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background disabled:cursor-not-allowed disabled:opacity-60';

  const variants = {
    primary: 'bg-brand-primary text-white shadow-lg shadow-purple-400/15 hover:bg-purple-500 hover:shadow-purple-400/25 focus:ring-purple-400',
    secondary: 'bg-background-tertiary text-foreground-primary border border-border hover:border-border-strong focus:ring-border-strong',
    outline: 'border border-border text-foreground-primary hover:border-border-colored hover:bg-purple-15 focus:ring-purple-400',
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
      {...safeProps}
    >
      {children}
    </button>
  );
};

export default Button;

