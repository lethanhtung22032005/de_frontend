import { createContext, useCallback, useContext, useState } from 'react';
import Toast from '../components/Toast.jsx';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [message, setMessage] = useState(null);

  const showToast = useCallback((nextMessage) => {
    setMessage(nextMessage);
  }, []);

  const hideToast = useCallback(() => {
    setMessage(null);
  }, []);

  return (
    <ToastContext.Provider value={showToast}>
      {children}
      {message && <Toast message={message} onClose={hideToast} />}
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}
