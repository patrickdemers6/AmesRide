import { format } from 'date-fns';
import React from 'react';
import { Modal, Pressable, StyleSheet, View } from 'react-native';
import { Button, IconButton, Text } from 'react-native-paper';

import {
  cancelQuickNotify,
  getPendingQuickNotify,
  scheduleQuickNotify,
} from '../../../services/notifications';

const QuickNotifyModal = ({ visible, onDismiss, arrival, route, stop }) => {
  const [scheduling, setScheduling] = React.useState(false);
  const [confirmed, setConfirmed] = React.useState(false);
  const [hasExisting, setHasExisting] = React.useState(false);
  const [minutesBefore, setMinutesBefore] = React.useState(1);

  const diffMins = React.useMemo(() => {
    if (!arrival) return 0;
    const { hours, minutes } = arrival.arrival_time;
    const adjHours = hours >= 24 ? hours % 24 : hours;
    const d = new Date();
    d.setHours(adjHours, minutes, 0, 0);
    if (hours >= 24) d.setDate(d.getDate() + 1);
    return Math.ceil((d - new Date()) / 60000);
  }, [arrival]);

  React.useEffect(() => {
    if (!visible || !arrival) {
      setConfirmed(false);
      setHasExisting(false);
      return;
    }
    setMinutesBefore(Math.max(1, diffMins - 1));
    getPendingQuickNotify().then((pending) => {
      setHasExisting(Boolean(pending[arrival.trip_id]));
    });
  }, [visible, arrival, diffMins]);

  const handleNotify = async () => {
    if (!arrival || !route || !stop) return;
    setScheduling(true);
    try {
      const id = await scheduleQuickNotify({ arrival, route, stop, minutesBefore });
      if (id) {
        setConfirmed(true);
        setTimeout(onDismiss, 1500);
      }
    } catch (e) {
      console.warn('Failed to schedule notification:', e);
    } finally {
      setScheduling(false);
    }
  };

  const handleCancelExisting = async () => {
    if (!arrival) return;
    setScheduling(true);
    try {
      await cancelQuickNotify(arrival.trip_id);
      onDismiss();
    } catch (e) {
      console.warn('Failed to cancel notification:', e);
    } finally {
      setScheduling(false);
    }
  };

  if (!arrival || !route || !stop) return null;

  const { hours, minutes } = arrival.arrival_time;
  const adjHours = hours >= 24 ? hours % 24 : hours;
  const arrivalDate = new Date();
  arrivalDate.setHours(adjHours, minutes, 0, 0);
  if (hours >= 24) arrivalDate.setDate(arrivalDate.getDate() + 1);
  const arrivalTimeStr = format(arrivalDate, 'h:mm a');
  const routeColor = `#${route.route_color || '1976D2'}`;
  const maxMins = Math.max(1, diffMins - 1);

  return (
    <Modal visible={visible} transparent animationType="fade">
      <Pressable style={styles.overlay} onPress={scheduling ? undefined : onDismiss}>
        <Pressable onPress={() => {}}>
          <View style={styles.card}>
            <View style={[styles.colorStrip, { backgroundColor: routeColor }]} />
            <View style={styles.body}>
              {confirmed ? (
                <View style={styles.confirmedContainer}>
                  <Text variant="titleMedium" style={styles.confirmedTitle}>
                    Notification scheduled!
                  </Text>
                  <Text variant="bodySmall" style={styles.muted}>
                    You'll be notified before {route.route_long_name} arrives.
                  </Text>
                </View>
              ) : (
                <>
                  <Text variant="titleMedium" style={styles.routeName}>
                    {route.route_long_name}
                  </Text>
                  <Text variant="bodySmall" style={styles.muted}>
                    at {stop.stop_name}
                  </Text>

                  <View style={styles.arrivalRow}>
                    <Text variant="headlineSmall" style={styles.arrivalTime}>
                      {arrivalTimeStr}
                    </Text>
                    <Text variant="bodyMedium" style={styles.countdown}>
                      {diffMins > 1
                        ? `${diffMins} min away`
                        : diffMins === 1
                        ? '1 min away'
                        : 'arriving now'}
                    </Text>
                  </View>

                  {hasExisting ? (
                    <View style={styles.existingSection}>
                      <Text variant="bodySmall" style={styles.existingMsg}>
                        A notification is already set for this bus.
                      </Text>
                      <Button
                        mode="text"
                        onPress={handleCancelExisting}
                        disabled={scheduling}
                        textColor="#B00020">
                        Cancel notification
                      </Button>
                      <Button
                        mode="text"
                        onPress={() => setHasExisting(false)}
                        disabled={scheduling}>
                        Set a different time
                      </Button>
                    </View>
                  ) : (
                    <>
                      <Text variant="labelLarge" style={styles.chooseLabel}>
                        Notify me before arrival
                      </Text>
                      <View style={styles.stepper}>
                        <IconButton
                          icon="minus"
                          mode="outlined"
                          disabled={minutesBefore <= 1 || scheduling}
                          onPress={() => setMinutesBefore((m) => Math.max(1, m - 1))}
                        />
                        <View style={styles.stepperValue}>
                          <Text variant="displaySmall" style={styles.stepperNumber}>
                            {minutesBefore}
                          </Text>
                          <Text variant="bodySmall" style={styles.stepperLabel}>
                            {minutesBefore === 1 ? 'minute' : 'minutes'} before
                          </Text>
                        </View>
                        <IconButton
                          icon="plus"
                          mode="outlined"
                          disabled={minutesBefore >= maxMins || scheduling}
                          onPress={() => setMinutesBefore((m) => Math.min(maxMins, m + 1))}
                        />
                      </View>
                      <Button
                        mode="contained"
                        onPress={handleNotify}
                        disabled={scheduling || diffMins <= 1}
                        style={styles.notifyBtn}>
                        Notify me
                      </Button>
                    </>
                  )}

                  <Button
                    mode="text"
                    onPress={onDismiss}
                    disabled={scheduling}
                    style={styles.dismissBtn}>
                    Dismiss
                  </Button>
                </>
              )}
            </View>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    width: '100%',
    maxWidth: 340,
    overflow: 'hidden',
  },
  colorStrip: {
    height: 6,
  },
  body: {
    padding: 20,
  },
  routeName: {
    fontWeight: 'bold',
    marginBottom: 2,
  },
  muted: {
    color: '#666',
    marginBottom: 12,
  },
  arrivalRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 10,
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#ddd',
  },
  arrivalTime: {
    fontWeight: '600',
  },
  countdown: {
    color: '#555',
  },
  chooseLabel: {
    marginBottom: 10,
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  stepperValue: {
    alignItems: 'center',
    minWidth: 100,
  },
  stepperNumber: {
    fontWeight: '700',
    lineHeight: 52,
  },
  stepperLabel: {
    color: '#555',
    marginTop: -4,
  },
  notifyBtn: {
    marginBottom: 4,
  },
  dismissBtn: {
    marginTop: 4,
    alignSelf: 'center',
  },
  confirmedContainer: {
    alignItems: 'center',
    paddingVertical: 8,
    gap: 6,
  },
  confirmedTitle: {
    fontWeight: 'bold',
  },
  existingSection: {
    marginBottom: 4,
    gap: 8,
  },
  existingMsg: {
    color: '#555',
  },
});

export default QuickNotifyModal;
