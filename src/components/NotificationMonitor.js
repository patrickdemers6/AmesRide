import React from 'react';
import { AppState } from 'react-native';

import {
  checkAndScheduleRecurringNotifications,
  getScheduledNotifications,
} from '../services/notifications';

const POLL_INTERVAL_MS = 60 * 1000; // 1 minute

/**
 * When app is in foreground, periodically check recurring notification configs
 * and schedule notifications when a bus is X minutes away during the time window.
 */
const NotificationMonitor = ({ children, storageReady = false }) => {
  const intervalRef = React.useRef(null);
  const appStateRef = React.useRef(AppState.currentState);

  React.useEffect(() => {
    if (!storageReady) return;

    const checkRecurring = async () => {
      try {
        const scheduled = await getScheduledNotifications();
        if (scheduled.length === 0) return;
        await checkAndScheduleRecurringNotifications();
      } catch (e) {
        console.warn('NotificationMonitor check failed:', e);
      }
    };

    const subscription = AppState.addEventListener('change', (nextState) => {
      if (appStateRef.current.match(/inactive|background/) && nextState === 'active') {
        checkRecurring();
      }
      appStateRef.current = nextState;
    });

    intervalRef.current = setInterval(checkRecurring, POLL_INTERVAL_MS);
    checkRecurring();

    return () => {
      subscription.remove();
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [storageReady]);

  return children;
};

export default NotificationMonitor;
