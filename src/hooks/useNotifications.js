import { useNotifications as useNotificationsContext } from '../context/NotificationContext';

/**
 * Custom hook to access notification system
 * Re-exports the context hook for easier imports
 */
export function useNotifications() {
  return useNotificationsContext();
}

export default useNotifications;

