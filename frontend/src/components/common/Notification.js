import React, { useEffect } from 'react';
import { X, AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react';
import { useApp } from '../../context/AppContext';

// Individual notification component
const NotificationItem = ({ notification, onClose }) => {
  const { id, message, type, duration } = notification;
  
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose(id);
      }, duration);
      
      return () => clearTimeout(timer);
    }
  }, [id, duration, onClose]);
  
  // Determine icon and styles based on notification type
  const getTypeStyles = () => {
    switch (type) {
      case 'success':
        return {
          containerClass: 'bg-green-50 border-green-500',
          iconClass: 'text-green-500',
          icon: <CheckCircle size={20} />
        };
      case 'error':
        return {
          containerClass: 'bg-red-50 border-red-500',
          iconClass: 'text-red-500',
          icon: <AlertCircle size={20} />
        };
      case 'warning':
        return {
          containerClass: 'bg-yellow-50 border-yellow-500',
          iconClass: 'text-yellow-500',
          icon: <AlertTriangle size={20} />
        };
      case 'info':
      default:
        return {
          containerClass: 'bg-blue-50 border-blue-500',
          iconClass: 'text-blue-500',
          icon: <Info size={20} />
        };
    }
  };
  
  const { containerClass, iconClass, icon } = getTypeStyles();
  
  return (
    <div className={`notification-item ${containerClass} border-l-4 p-4 mb-3 rounded shadow-md flex items-start`}>
      <div className={`mr-3 ${iconClass}`}>
        {icon}
      </div>
      <div className="flex-1 mr-2">
        <p className="text-sm">{message}</p>
      </div>
      <button 
        onClick={() => onClose(id)} 
        className="text-gray-500 hover:text-gray-700 focus:outline-none"
        aria-label="Close notification"
      >
        <X size={18} />
      </button>
    </div>
  );
};

// Notification container component
const Notification = () => {
  const { notifications, removeNotification } = useApp();
  
  if (notifications.length === 0) {
    return null;
  }
  
  return (
    <div className="notification-container fixed top-4 right-4 z-50 w-80">
      {notifications.map(notification => (
        <NotificationItem
          key={notification.id}
          notification={notification}
          onClose={removeNotification}
        />
      ))}
    </div>
  );
};

export default Notification;
