import React from 'react';
import Button from './Button';

/**
 * Empty state component to display when there's no data
 */
const EmptyState = ({
  title = 'No data available',
  description = 'There are no items to display at this time.',
  icon = null,
  action = null,
  actionText = 'Add New',
  actionVariant = 'primary',
  className = '',
}) => {
  return (
    <div className={`empty-state p-8 text-center ${className}`}>
      {icon && (
        <div className="empty-state-icon flex justify-center mb-4">
          {icon}
        </div>
      )}
      
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        {title}
      </h3>
      
      <p className="text-sm text-gray-500 mb-6 max-w-md mx-auto">
        {description}
      </p>
      
      {action && (
        <Button
          onClick={action}
          variant={actionVariant}
        >
          {actionText}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
