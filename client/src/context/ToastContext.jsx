import { createContext, useContext, useState, ReactNode } from 'react';

// type ToastType = 'success' | 'error' | 'info';

const ToastContext = createContext(undefined);

export const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState(null);

  const showToast = (toast) => {
    setToast(toast);
    setTimeout(() => setToast(null), 3000); // auto dismiss in 3s
  };

  const getColorClasses = (type = 'info') => {
    switch (type) {
      case 'success':
        return 'bg-green-100 text-green-900 border-green-300';
      case 'error':
        return 'bg-red-100 text-red-900 border-red-300';
      case 'info':
      default:
        return 'bg-blue-100 text-blue-900 border-blue-300';
    }
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast && (
        <div className={`fixed top-5 right-5 z-50 px-4 py-3 border rounded-lg shadow-lg ${getColorClasses(toast.type)}`}>
          <p className="text-sm font-medium">{toast.message}</p>
        </div>
      )}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within a ToastProvider');
  return context;
};
