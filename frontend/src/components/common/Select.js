import React from 'react';
import { ChevronDown } from 'lucide-react';

/**
 * Reusable Select component with different variants and sizes
 */
const Select = ({
  id,
  name,
  label,
  value,
  onChange,
  options = [],
  placeholder = 'Select an option',
  error = '',
  disabled = false,
  required = false,
  className = '',
  fullWidth = true,
  size = 'md',
  helperText = '',
  ...rest
}) => {
  // Base classes
  const baseClasses = 'rounded border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors appearance-none';
  
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
  
  // Combine all classes
  const selectClasses = `
    ${baseClasses} 
    ${sizeClasses[size] || sizeClasses.md} 
    ${errorClasses} 
    ${disabledClasses} 
    ${widthClasses} 
    ${className}
  `;
  
  return (
    <div className={`select-container ${fullWidth ? 'w-full' : ''}`}>
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
        <select
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          disabled={disabled}
          required={required}
          className={selectClasses}
          {...rest}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          
          {options.map((option) => (
            <option 
              key={option.value} 
              value={option.value}
              disabled={option.disabled}
            >
              {option.label}
            </option>
          ))}
        </select>
        
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
          <ChevronDown size={16} />
        </div>
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

export default Select;
