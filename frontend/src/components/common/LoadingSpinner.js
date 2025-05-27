import React from 'react';

/**
 * Loading spinner component with different sizes and variants
 */
const LoadingSpinner = ({ 
  size = 'md', 
  variant = 'primary',
  fullScreen = false,
  text = 'Loading...',
  showText = true
}) => {
  // Size classes
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-2',
    lg: 'w-12 h-12 border-3',
    xl: 'w-16 h-16 border-4'
  };
  
  // Variant classes
  const variantClasses = {
    primary: 'border-blue-600',
    secondary: 'border-gray-600',
    success: 'border-green-600',
    danger: 'border-red-600',
    warning: 'border-yellow-500',
    info: 'border-blue-500'
  };
  
  // Spinner classes
  const spinnerClasses = `
    rounded-full
    border-t-transparent
    animate-spin
    ${sizeClasses[size] || sizeClasses.md}
    ${variantClasses[variant] || variantClasses.primary}
  `;
  
  // If fullScreen, render a full-screen overlay
  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-5 rounded-lg shadow-lg flex flex-col items-center">
          <div className={spinnerClasses}></div>
          {showText && <p className="mt-3 text-gray-700">{text}</p>}
        </div>
      </div>
    );
  }
  
  // Regular spinner
  return (
    <div className="flex flex-col items-center">
      <div className={spinnerClasses}></div>
      {showText && <p className="mt-2 text-sm text-gray-600">{text}</p>}
    </div>
  );
};

export default LoadingSpinner;
