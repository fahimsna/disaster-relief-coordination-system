import { useState, useCallback } from 'react';

export function useToast() {
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  const showNotification = useCallback((message, type = 'success') => {
    setToast({ show: true, message, type });
    const timer = setTimeout(() => {
      setToast({ show: false, message: '', type: 'success' });
    }, 4000);
    return () => clearTimeout(timer);
  }, []);

  return { toast, showNotification };
}