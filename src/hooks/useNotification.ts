import { useState, useCallback } from 'react';

type NotificationType = 'success' | 'error' | 'info' | 'warning';

interface Notification {
  message: string;
  type: NotificationType;
  id: string;
}

export const useNotification = () => {
  const [notification, setNotification] = useState<Notification | null>(null);

  const showNotification = useCallback(
    (message: string, type: NotificationType = 'info') => {
      const id = Date.now().toString();
      setNotification({ message, type, id });
      setTimeout(() => {
        setNotification((prev) => (prev?.id === id ? null : prev));
      }, 4000);
    },
    []
  );

  const hideNotification = useCallback(() => {
    setNotification(null);
  }, []);

  return { notification, showNotification, hideNotification };
};

export default useNotification;
