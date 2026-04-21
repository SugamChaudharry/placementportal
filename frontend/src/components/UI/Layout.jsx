import React from 'react';

const Container = ({ children, className = '' }) => (
  <div className={`container-base ${className}`}>
    {children}
  </div>
);

const PageHeader = ({ 
  title, 
  subtitle, 
  className = '',
  ...props 
}) => (
  <div className={`bg-gradient-to-r from-primary-500 to-primary-600 dark:from-primary-600 dark:to-primary-700 py-12 md:py-16 text-white ${className}`} {...props}>
    <div className="container-base">
      <h1 className="text-4xl md:text-5xl font-bold mb-2">{title}</h1>
      {subtitle && <p className="text-lg text-primary-100">{subtitle}</p>}
    </div>
  </div>
);

const Grid = ({ 
  children, 
  cols = 3, 
  gap = 6, 
  className = '' 
}) => {
  const colsClass = {
    1: 'grid-cols-1',
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-2 lg:grid-cols-3',
    4: 'md:grid-cols-2 lg:grid-cols-4',
  }[cols] || 'grid-cols-1';

  const gapClass = `gap-${gap}`;

  return (
    <div className={`grid grid-cols-1 ${colsClass} gap-${gap} ${className}`}>
      {children}
    </div>
  );
};

const Section = ({ 
  children, 
  className = '',
  ...props 
}) => (
  <section className={`section-padding ${className}`} {...props}>
    {children}
  </section>
);

const SectionHeader = ({ 
  title, 
  subtitle, 
  centered = true,
  className = '' 
}) => (
  <div className={`mb-12 ${centered ? 'text-center' : ''} ${className}`}>
    <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 dark:text-white mb-2">
      {title}
    </h2>
    {subtitle && (
      <p className="text-lg text-neutral-600 dark:text-neutral-400">
        {subtitle}
      </p>
    )}
  </div>
);

export { Container, PageHeader, Grid, Section, SectionHeader };
