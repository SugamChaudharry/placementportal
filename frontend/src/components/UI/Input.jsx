import React from 'react';

const Input = ({ 
  type = 'text', 
  placeholder, 
  className = '',
  error = false,
  ...props 
}) => {
  const baseClasses = 'w-full px-4 py-2.5 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-neutral-900 transition-all';
  
  const borderClasses = error 
    ? 'border-accent-500 focus:ring-accent-500' 
    : 'border-neutral-300 dark:border-neutral-600 focus:ring-primary-500 focus:border-transparent';

  return (
    <input
      type={type}
      placeholder={placeholder}
      className={`${baseClasses} ${borderClasses} ${className}`}
      {...props}
    />
  );
};

const Textarea = ({ 
  placeholder, 
  rows = 4,
  className = '',
  error = false,
  ...props 
}) => {
  const baseClasses = 'w-full px-4 py-2.5 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-neutral-900 transition-all resize-none';
  
  const borderClasses = error 
    ? 'border-accent-500 focus:ring-accent-500' 
    : 'border-neutral-300 dark:border-neutral-600 focus:ring-primary-500 focus:border-transparent';

  return (
    <textarea
      placeholder={placeholder}
      rows={rows}
      className={`${baseClasses} ${borderClasses} ${className}`}
      {...props}
    />
  );
};

const Select = ({ 
  options = [], 
  placeholder,
  className = '',
  error = false,
  ...props 
}) => {
  const baseClasses = 'w-full px-4 py-2.5 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-neutral-900 transition-all';
  
  const borderClasses = error 
    ? 'border-accent-500 focus:ring-accent-500' 
    : 'border-neutral-300 dark:border-neutral-600 focus:ring-primary-500 focus:border-transparent';

  return (
    <select
      className={`${baseClasses} ${borderClasses} ${className}`}
      {...props}
    >
      {placeholder && <option value="">{placeholder}</option>}
      {options.map((option, idx) => (
        <option key={idx} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};

const FormGroup = ({ label, children, error, className = '' }) => (
  <div className={`mb-4 ${className}`}>
    {label && (
      <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
        {label}
      </label>
    )}
    {children}
    {error && (
      <p className="mt-1 text-sm text-accent-600 dark:text-accent-400">{error}</p>
    )}
  </div>
);

export { Input, Textarea, Select, FormGroup };
export default Input;
