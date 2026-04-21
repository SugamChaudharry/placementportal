import React from 'react';

const Card = ({ 
  children, 
  className = '', 
  hover = true,
  ...props 
}) => {
  const hoverClass = hover ? 'hover:shadow-md' : '';
  const baseClasses = `bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 shadow-sm ${hoverClass} transition-shadow`;
  
  return (
    <div 
      className={`${baseClasses} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

// Card variants
const CardHeader = ({ children, className = '' }) => (
  <div className={`px-6 py-4 border-b border-neutral-200 dark:border-neutral-700 ${className}`}>
    {children}
  </div>
);

const CardBody = ({ children, className = '' }) => (
  <div className={`px-6 py-4 ${className}`}>
    {children}
  </div>
);

const CardFooter = ({ children, className = '' }) => (
  <div className={`px-6 py-4 border-t border-neutral-200 dark:border-neutral-700 ${className}`}>
    {children}
  </div>
);

Card.Header = CardHeader;
Card.Body = CardBody;
Card.Footer = CardFooter;

export default Card;
