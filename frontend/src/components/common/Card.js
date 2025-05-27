import React from 'react';

/**
 * Reusable Card component with different variants
 */
const Card = ({
  children,
  title,
  subtitle,
  footer,
  variant = 'default',
  className = '',
  headerClassName = '',
  bodyClassName = '',
  footerClassName = '',
  onClick,
  hoverable = false,
  ...rest
}) => {
  // Base classes
  const baseClasses = 'rounded-lg shadow-sm overflow-hidden';
  
  // Variant classes
  const variantClasses = {
    default: 'bg-white border border-gray-200',
    primary: 'bg-blue-50 border border-blue-200',
    success: 'bg-green-50 border border-green-200',
    danger: 'bg-red-50 border border-red-200',
    warning: 'bg-yellow-50 border border-yellow-200',
    info: 'bg-blue-50 border border-blue-200',
  };
  
  // Hoverable classes
  const hoverableClasses = hoverable ? 'transition-transform hover:shadow-md hover:-translate-y-1 cursor-pointer' : '';
  
  // Combine all classes
  const cardClasses = `
    ${baseClasses} 
    ${variantClasses[variant] || variantClasses.default} 
    ${hoverableClasses} 
    ${className}
  `;
  
  return (
    <div 
      className={cardClasses} 
      onClick={onClick}
      {...rest}
    >
      {(title || subtitle) && (
        <div className={`px-4 py-3 border-b border-gray-200 ${headerClassName}`}>
          {title && (
            <h3 className="text-lg font-medium text-gray-900">{title}</h3>
          )}
          {subtitle && (
            <p className="mt-1 text-sm text-gray-500">{subtitle}</p>
          )}
        </div>
      )}
      
      <div className={`p-4 ${bodyClassName}`}>
        {children}
      </div>
      
      {footer && (
        <div className={`px-4 py-3 border-t border-gray-200 ${footerClassName}`}>
          {footer}
        </div>
      )}
    </div>
  );
};

export default Card;
