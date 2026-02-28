import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

import getFromLocalStorage from '../state/utilities/localforage/getFromLocalStorage';
import getArrivals from '../state/utilities/request/getArrivals';

const NOTIFICATION_CHANNEL_ID = 'bus-arrivals';
const PENDING_QUICK_NOTIFY_KEY = 'amesride-pending-quick-notify';
const SCHEDULED_NOTIFICATIONS_KEY = 'amesride-scheduled-notifications';
const NOTIFIED_ARRIVALS_KEY = 'amesride-notified-arrivals';

// Configure how notifications are handled when app is in foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowList: true,
  }),
});

/**
 * Request notification permissions and set up Android channel
 */
export async function setupNotifications() {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync(NOTIFICATION_CHANNEL_ID, {
      name: 'Bus Arrivals',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
    });
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  return finalStatus === 'granted';
}

/**
 * Schedule a one-time notification for X minutes before a specific arrival (Quick Notify)
 * @param {Object} params
 * @param {Object} params.arrival - arrival object with trip_id, arrival_time
 * @param {Object} params.route - route object with route_long_name
 * @param {Object} params.stop - stop object with stop_id, stop_name
 * @param {number} params.minutesBefore - minutes before arrival to notify
 * @returns {Promise<string|null>} notification ID or null
 */
export async function scheduleQuickNotify({ arrival, route, stop, minutesBefore }) {
  const hasPermission = await setupNotifications();
  if (!hasPermission) return null;

  const { hours, minutes } = arrival.arrival_time;
  const arrivalDate = new Date();
  arrivalDate.setHours(hours >= 24 ? hours % 24 : hours, minutes, 0, 0);
  if (hours >= 24) {
    arrivalDate.setDate(arrivalDate.getDate() + 1);
  }

  const notifyAt = new Date(arrivalDate.getTime() - minutesBefore * 60 * 1000);
  const now = new Date();

  if (notifyAt <= now) {
    return null; // Already past notification time
  }

  const notificationId = await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Bus arriving soon',
      body: `${route.route_long_name} arrives at ${stop.stop_name} in ~${minutesBefore} min`,
      data: {
        type: 'quick-notify',
        tripId: arrival.trip_id,
        stopId: stop.stop_id,
        routeId: route.route_id,
      },
      channelId: NOTIFICATION_CHANNEL_ID,
    },
    trigger: notifyAt,
  });

  // Store for deduplication and potential cancellation on ETA update
  const pending = await getPendingQuickNotify();
  pending[arrival.trip_id] = {
    notificationId,
    stopId: stop.stop_id,
    scheduledFor: notifyAt.getTime(),
  };
  await AsyncStorage.setItem(PENDING_QUICK_NOTIFY_KEY, JSON.stringify(pending));

  return notificationId;
}

/**
 * Get pending quick notify entries (trip_id -> { notificationId, ... })
 */
export async function getPendingQuickNotify() {
  const data = await AsyncStorage.getItem(PENDING_QUICK_NOTIFY_KEY);
  return data ? JSON.parse(data) : {};
}

/**
 * Cancel a quick notify by trip_id
 */
export async function cancelQuickNotify(tripId) {
  const pending = await getPendingQuickNotify();
  if (pending[tripId]) {
    await Notifications.cancelScheduledNotificationAsync(pending[tripId].notificationId);
    delete pending[tripId];
    await AsyncStorage.setItem(PENDING_QUICK_NOTIFY_KEY, JSON.stringify(pending));
  }
}

/**
 * Cancel all scheduled notifications
 */
export async function cancelAllNotifications() {
  await Notifications.cancelAllScheduledNotificationsAsync();
  await AsyncStorage.multiRemove([
    PENDING_QUICK_NOTIFY_KEY,
    SCHEDULED_NOTIFICATIONS_KEY,
    NOTIFIED_ARRIVALS_KEY,
  ]);
}

// --- Recurring (Scheduled) Notifications ---

/**
 * @typedef {Object} ScheduledNotification
 * @property {string} id - unique ID
 * @property {string} stopId
 * @property {string} stopName
 * @property {string} routeId
 * @property {string} routeName
 * @property {number[]} daysOfWeek - 0=Sun, 1=Mon, ..., 6=Sat
 * @property {number} startHour - 0-23
 * @property {number} startMinute - 0-59
 * @property {number} endHour - 0-23
 * @property {number} endMinute - 0-59
 * @property {number} minutesBefore
 */

/**
 * Get all scheduled (recurring) notifications
 */
export async function getScheduledNotifications() {
  const data = await AsyncStorage.getItem(SCHEDULED_NOTIFICATIONS_KEY);
  return data ? JSON.parse(data) : [];
}

/**
 * Save scheduled notifications
 */
async function saveScheduledNotifications(list) {
  await AsyncStorage.setItem(SCHEDULED_NOTIFICATIONS_KEY, JSON.stringify(list));
}

/**
 * Add a scheduled notification
 */
export async function addScheduledNotification(config) {
  const list = await getScheduledNotifications();
  const id = `sched-${Date.now()}-${Math.random().toString(36).slice(2)}`;
  const item = { ...config, id };
  list.push(item);
  await saveScheduledNotifications(list);
  return id;
}

/**
 * Update a scheduled notification
 */
export async function updateScheduledNotification(id, updates) {
  const list = await getScheduledNotifications();
  const idx = list.findIndex((s) => s.id === id);
  if (idx >= 0) {
    list[idx] = { ...list[idx], ...updates };
    await saveScheduledNotifications(list);
  }
}

/**
 * Delete a scheduled notification
 */
export async function deleteScheduledNotification(id) {
  const list = await getScheduledNotifications();
  const filtered = list.filter((s) => s.id !== id);
  await saveScheduledNotifications(filtered);
}

/**
 * Check if we've already notified for this arrival (avoid duplicates)
 */
async function hasNotifiedForArrival(stopId, tripId) {
  const data = await AsyncStorage.getItem(NOTIFIED_ARRIVALS_KEY);
  const set = data ? new Set(JSON.parse(data)) : new Set();
  return set.has(`${stopId}-${tripId}`);
}

/**
 * Mark arrival as notified
 */
async function markArrivalNotified(stopId, tripId) {
  const data = await AsyncStorage.getItem(NOTIFIED_ARRIVALS_KEY);
  const arr = data ? JSON.parse(data) : [];
  arr.push(`${stopId}-${tripId}`);
  // Keep last 100 to prevent unbounded growth
  if (arr.length > 100) arr.splice(0, arr.length - 50);
  await AsyncStorage.setItem(NOTIFIED_ARRIVALS_KEY, JSON.stringify(arr));
}

/**
 * Check arrivals for a stop and schedule notifications for matching recurring configs
 * Called when app is in foreground or from background task
 */
export async function checkAndScheduleRecurringNotifications() {
  const hasPermission = await setupNotifications();
  if (!hasPermission) return;

  const scheduled = await getScheduledNotifications();
  if (scheduled.length === 0) return;

  const now = new Date();
  const currentDay = now.getDay(); // 0=Sun, 1=Mon, ...
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  for (const config of scheduled) {
    if (!config.daysOfWeek.includes(currentDay)) continue;

    const windowStart = config.startHour * 60 + config.startMinute;
    const windowEnd = config.endHour * 60 + config.endMinute;
    if (currentMinutes < windowStart || currentMinutes > windowEnd) continue;

    try {
      const stopId = config.stopId.includes('-') ? config.stopId : parseInt(config.stopId, 10);
      const arrivals = await getArrivals(stopId);
      if (!arrivals || !Array.isArray(arrivals)) continue;

      const data = await getFromLocalStorage('dataState');
      const trips = data?.trips || {};

      for (const arrival of arrivals) {
        const trip = trips[arrival.trip_id];
        const tripRouteId = trip?.route_id || arrival.route_id || arrival.routeId;
        if (config.routeId && String(tripRouteId) !== String(config.routeId)) continue;

        const { hours, minutes } = arrival.arrival_time || arrival.arrivalTime || {};
        if (hours === undefined || minutes === undefined) continue;

        const arrivalDate = new Date();
        arrivalDate.setHours(hours >= 24 ? hours % 24 : hours, minutes, 0, 0);
        if (hours >= 24) arrivalDate.setDate(arrivalDate.getDate() + 1);

        const diffMinutes = Math.ceil((arrivalDate - now) / (60 * 1000));
        if (diffMinutes <= 0 || diffMinutes > 180) continue;

        if (diffMinutes <= config.minutesBefore) {
          const alreadyNotified = await hasNotifiedForArrival(config.stopId, arrival.trip_id);
          if (alreadyNotified) continue;

          await Notifications.scheduleNotificationAsync({
            content: {
              title: 'Bus arriving soon',
              body: `${config.routeName} arrives at ${config.stopName} in ~${diffMinutes} min`,
              data: {
                type: 'recurring-notify',
                configId: config.id,
                tripId: arrival.trip_id,
                stopId: config.stopId,
              },
              channelId: NOTIFICATION_CHANNEL_ID,
            },
            trigger: null, // immediate
          });

          await markArrivalNotified(config.stopId, arrival.trip_id);
        }
      }
    } catch (e) {
      console.warn('Error checking arrivals for notification:', e);
    }
  }
}
