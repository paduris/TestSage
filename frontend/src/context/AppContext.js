import React, { createContext, useContext, useState } from 'react';

// Create context
const AppContext = createContext();

// Context provider component
export const AppProvider = ({ children }) => {
  // State for notifications
  const [notifications, setNotifications] = useState([]);
  
  // State for selected repository
  const [selectedRepository, setSelectedRepository] = useState(null);
  
  // Add a notification
  const addNotification = (message, type = 'info', duration = 5000) => {
    const id = Date.now();
    const notification = { id, message, type, duration };
    
    setNotifications(prev => [...prev, notification]);
    
    // Auto-remove notification after duration
    if (duration > 0) {
      setTimeout(() => {
        removeNotification(id);
      }, duration);
    }
    
    return id;
  };
  
  // Remove a notification by ID
  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };
  
  // Success notification helper
  const notifySuccess = (message, duration = 5000) => {
    return addNotification(message, 'success', duration);
  };
  
  // Error notification helper
  const notifyError = (message, duration = 5000) => {
    return addNotification(message, 'error', duration);
  };
  
  // Warning notification helper
  const notifyWarning = (message, duration = 5000) => {
    return addNotification(message, 'warning', duration);
  };
  
  // Info notification helper
  const notifyInfo = (message, duration = 5000) => {
    return addNotification(message, 'info', duration);
  };
  
  // Context value
  const contextValue = {
    // Notification state and functions
    notifications,
    addNotification,
    removeNotification,
    notifySuccess,
    notifyError,
    notifyWarning,
    notifyInfo,
    
    // Repository state and functions
    selectedRepository,
    setSelectedRepository,
  };
  
  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};

// Custom hook to use the app context
export const useApp = () => {
  const context = useContext(AppContext);
  
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  
  return context;
};
