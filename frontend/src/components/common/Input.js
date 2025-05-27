import React from 'react';

/**
 * Reusable Input component with different variants and sizes
 */
const Input = ({
  id,
  name,
  type = 'text',
  label,
  value,
  onChange,
  placeholder = '',
  error = '',
  disabled = false,
  required = false,
  className = '',
  fullWidth = true,
  size = 'md',
  helperText = '',
  icon = null,
  iconPosition = 'left',
  ...rest
}) => {
  // Base classes
  const baseClasses = 'rounded border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors';
  
  // Size classes
  const sizeClasses = {
    sm: 'text-sm py-1 px-2',
    md: 'py-2 px-3',
    lg: 'text-lg py-2.5 px-4',
  };
  
  // Error classes
  const errorClasses = error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300';
  
  // Disabled classes
  const disabledClasses = disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white';
  
  // Width classes
  const widthClasses = fullWidth ? 'w-full' : '';
  
  // Icon classes
  const iconClasses = icon ? (iconPosition === 'left' ? 'pl-10' : 'pr-10') : '';
  
  // Combine all classes
  const inputClasses = `
    ${baseClasses} 
    ${sizeClasses[size] || sizeClasses.md} 
    ${errorClasses} 
    ${disabledClasses} 
    ${widthClasses} 
    ${iconClasses} 
    ${className}
  `;
  
  return (
    <div className={`input-container ${fullWidth ? 'w-full' : ''}`}>
      {label && (
        <label 
          htmlFor={id} 
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        {icon && iconPosition === 'left' && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
            {icon}
          </div>
        )}
        
        <input
          id={id}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          className={inputClasses}
          {...rest}
        />
        
        {icon && iconPosition === 'right' && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-500">
            {icon}
          </div>
        )}
      </div>
      
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
      
      {helperText && !error && (
        <p className="mt-1 text-sm text-gray-500">{helperText}</p>
      )}
    </div>
  );
};

export default Input;
