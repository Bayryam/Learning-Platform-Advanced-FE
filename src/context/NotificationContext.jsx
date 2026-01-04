import { createContext, useContext, useState, useEffect } from 'react';
import notificationService from '../services/notificationService';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';

const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const { user } = useAuth();
  const { showToast } = useToast();

  useEffect(() => {
    if (!user) {
      console.log('User logged out - clearing notifications');
      setNotifications([]);
      setUnreadCount(0);
      return;
    }

    console.log('User changed (ID:', user.id, ') - clearing old notifications');
    setNotifications([]);
    setUnreadCount(0);
  }, [user?.id]);

  useEffect(() => {
    if (!user) {
      return;
    }

    const unsubscribe = notificationService.onNotification((notification) => {
      const newNotification = {
        ...notification,
        id: Date.now(),
        read: false,
        timestamp: new Date().toISOString()
      };

      setNotifications(prev => [newNotification, ...prev]);
      setUnreadCount(prev => prev + 1);

      showToast(notification.message, 'info');

      if (Notification.permission === 'granted') {
        new Notification('New Assignment! 📚', {
          body: notification.message,
          icon: '/vite.svg',
          badge: '/vite.svg'
        });
      } else if (Notification.permission === 'default') {
        Notification.requestPermission();
      }

      try {
        const audio = new Audio('/notification.mp3');
        audio.volume = 0.5;
        audio.play().catch(() => {
        });
      } catch {
      }
    });

    return () => {
      unsubscribe();
    };
  }, [user, showToast]);

  const markAsRead = (notificationId) => {
    setNotifications(prev =>
      prev.map(n =>
        n.id === notificationId ? { ...n, read: true } : n
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(n => ({ ...n, read: true }))
    );
    setUnreadCount(0);
  };

  const clearNotification = (notificationId) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
    const notification = notifications.find(n => n.id === notificationId);
    if (notification && !notification.read) {
      setUnreadCount(prev => Math.max(0, prev - 1));
    }
  };

  const clearAllNotifications = () => {
    setNotifications([]);
    setUnreadCount(0);
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        markAsRead,
        markAllAsRead,
        clearNotification,
        clearAllNotifications
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider');
  }
  return context;
};

