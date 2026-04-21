import React from 'react';

const Badge = ({ 
  children, 
  variant = 'primary', 
  size = 'md',
  className = '',
  ...props 
}) => {
  const baseClasses = 'inline-flex items-center font-semibold rounded-full transition-colors';
  
  const variants = {
    primary: 'bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200',
    secondary: 'bg-neutral-100 dark:bg-neutral-700 text-neutral-800 dark:text-neutral-200',
    success: 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200',
    danger: 'bg-accent-100 dark:bg-accent-900 text-accent-800 dark:text-accent-200',
    warning: 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200',
    info: 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-base',
  };

  const finalClasses = `${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`;

  return (
    <span 
      className={finalClasses}
      {...props}
    >
      {children}
    </span>
  );
};

export default Badge;
