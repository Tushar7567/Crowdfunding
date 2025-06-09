const Toast = ({ message, type = 'info' }) => {
  const baseStyle =
    'fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg flex items-center transition-opacity duration-300';
  const typeStyles = {
    success: 'bg-green-100 text-green-800 border border-green-300',
    error: 'bg-red-100 text-red-800 border border-red-300',
    info: 'bg-blue-100 text-blue-800 border border-blue-300',
  };

  return (
    <div className={`${baseStyle} ${typeStyles[type]}`}>
      <span className="text-sm font-medium">{message}</span>
    </div>
  );
};

export default Toast;
