import React from 'react';
import { Modal, ScrollView, StyleSheet, View } from 'react-native';
import { Button, FAB, List, Text } from 'react-native-paper';
import { useRecoilValue } from 'recoil';

import {
  addScheduledNotification,
  deleteScheduledNotification,
  getScheduledNotifications,
  setupNotifications,
  updateScheduledNotification,
} from '../../services/notifications';
import { dataState } from '../../state/atoms';
import { routesSortedState } from '../../state/selectors';
import ColorCircle from '../ColorCircle';

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const SettingsBusNotifications = () => {
  const data = useRecoilValue(dataState);
  const routes = useRecoilValue(routesSortedState);
  const [notifications, setNotifications] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [showAddForm, setShowAddForm] = React.useState(false);
  const [editingNotification, setEditingNotification] = React.useState(null);

  const loadNotifications = React.useCallback(async () => {
    const list = await getScheduledNotifications();
    setNotifications(list);
  }, []);

  React.useEffect(() => {
    loadNotifications();
    setLoading(false);
  }, [loadNotifications]);

  const handleAdd = () => {
    setEditingNotification(null);
    setShowAddForm(true);
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        {loading ? (
          <Text style={styles.empty}>Loading...</Text>
        ) : notifications.length === 0 ? (
          <Text style={styles.empty}>
            No bus notifications yet. Add one to get notified before your bus arrives.
          </Text>
        ) : (
          notifications.map((n) => (
            <NotificationItem
              key={n.id}
              notification={n}
              onDelete={async () => {
                await deleteScheduledNotification(n.id);
                loadNotifications();
              }}
              onEdit={(notif) => setEditingNotification(notif)}
            />
          ))
        )}
      </ScrollView>
      <FAB style={styles.fab} icon="plus" onPress={handleAdd} label="Add notification" />
      <Modal visible={showAddForm || !!editingNotification} animationType="slide" transparent>
        <AddNotificationForm
          data={data}
          routes={routes}
          editing={editingNotification}
          onSave={async () => {
            setShowAddForm(false);
            setEditingNotification(null);
            loadNotifications();
          }}
          onCancel={() => {
            setShowAddForm(false);
            setEditingNotification(null);
          }}
        />
      </Modal>
    </View>
  );
};

const NotificationItem = ({ notification, onDelete, onEdit }) => {
  const [expanded, setExpanded] = React.useState(false);
  const daysStr = (notification.daysOfWeek || []).map((d) => DAY_NAMES[d]).join(', ');
  const timeStr = `${formatTime(notification.startHour, notification.startMinute)} - ${formatTime(
    notification.endHour,
    notification.endMinute
  )}`;

  return (
    <List.Accordion
      title={`${notification.routeName} at ${notification.stopName}`}
      description={`${daysStr} • ${timeStr} • ${notification.minutesBefore} min before`}
      expanded={expanded}
      onPress={() => setExpanded(!expanded)}>
      <List.Item
        title="Edit"
        left={(props) => <List.Icon {...props} icon="pencil" />}
        onPress={() => {
          setExpanded(false);
          onEdit(notification);
        }}
      />
      <List.Item
        title="Delete"
        left={(props) => <List.Icon {...props} icon="delete" color="#B00020" />}
        onPress={onDelete}
      />
    </List.Accordion>
  );
};

function formatTime(h, m) {
  const period = h >= 12 ? 'PM' : 'AM';
  const hour = h % 12 || 12;
  const min = m.toString().padStart(2, '0');
  return `${hour}:${min} ${period}`;
}

const AddNotificationForm = ({ data, routes, editing, onSave, onCancel }) => {
  const [stopId, setStopId] = React.useState(editing?.stopId ?? null);
  const [routeId, setRouteId] = React.useState(editing?.routeId ?? null);
  const [daysOfWeek, setDaysOfWeek] = React.useState(editing?.daysOfWeek ?? [1, 2, 3, 4, 5]);
  const [startHour, setStartHour] = React.useState(editing?.startHour ?? 8);
  const [startMinute, setStartMinute] = React.useState(editing?.startMinute ?? 0);
  const [endHour, setEndHour] = React.useState(editing?.endHour ?? 10);
  const [endMinute, setEndMinute] = React.useState(editing?.endMinute ?? 0);
  const [minutesBefore, setMinutesBefore] = React.useState(editing?.minutesBefore ?? 5);
  const [saving, setSaving] = React.useState(false);
  const [step, setStep] = React.useState(editing ? 3 : 1);

  const stops = data?.stops ? Object.values(data.stops) : [];

  const toggleDay = (day) => {
    setDaysOfWeek((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day].sort()
    );
  };

  const handleSave = async () => {
    if (!stopId || !routeId) return;
    setSaving(true);
    try {
      const hasPermission = await setupNotifications();
      if (!hasPermission) {
        alert('Notification permission is required.');
        setSaving(false);
        return;
      }

      const stop = data?.stops?.[stopId];
      const route = data?.routes?.[routeId];
      const config = {
        stopId: String(stopId),
        stopName: stop?.stop_name || editing?.stopName || 'Unknown',
        routeId: String(routeId),
        routeName: route?.route_long_name || editing?.routeName || 'Unknown',
        daysOfWeek,
        startHour,
        startMinute,
        endHour,
        endMinute,
        minutesBefore,
      };

      if (editing) {
        await updateScheduledNotification(editing.id, config);
      } else {
        await addScheduledNotification(config);
      }
      onSave();
    } catch (e) {
      console.warn('Failed to save notification:', e);
    } finally {
      setSaving(false);
    }
  };

  if (step === 1) {
    return (
      <View style={styles.form}>
        <Text style={styles.formTitle}>Select stop</Text>
        <ScrollView style={styles.formScroll}>
          {stops.map((stop) => (
            <List.Item
              key={stop.stop_id}
              title={stop.stop_name}
              onPress={() => {
                setStopId(stop.stop_id);
                setStep(2);
              }}
            />
          ))}
        </ScrollView>
        <Button onPress={onCancel}>Cancel</Button>
      </View>
    );
  }

  if (step === 2) {
    return (
      <View style={styles.form}>
        <Text style={styles.formTitle}>Select route</Text>
        <ScrollView style={styles.formScroll}>
          {(routes || []).map((route) => (
            <List.Item
              key={route.route_id}
              title={route.route_long_name}
              left={() => <ColorCircle size={24} color={`#${route.route_color}`} />}
              onPress={() => {
                setRouteId(route.route_id);
                setStep(3);
              }}
            />
          ))}
        </ScrollView>
        <Button onPress={() => setStep(1)}>Back</Button>
      </View>
    );
  }

  return (
    <View style={styles.form}>
      <Text style={styles.formTitle}>Configure notification</Text>
      <ScrollView style={styles.formScroll}>
        <Text style={styles.sectionLabel}>Days of week</Text>
        <View style={styles.daysRow}>
          {DAY_NAMES.map((name, i) => (
            <Button
              key={i}
              mode={daysOfWeek.includes(i) ? 'contained' : 'outlined'}
              compact
              onPress={() => toggleDay(i)}
              style={styles.dayButton}>
              {name}
            </Button>
          ))}
        </View>

        <Text style={styles.sectionLabel}>Time window</Text>
        <List.Item
          title={`Start: ${formatTime(startHour, startMinute)}`}
          description="When to start monitoring (e.g., 8:00 AM)"
        />
        <View style={styles.presetRow}>
          {[
            [6, 0],
            [7, 0],
            [8, 0],
            [9, 0],
          ].map(([h, m]) => (
            <Button
              key={`s-${h}`}
              mode={startHour === h ? 'contained' : 'outlined'}
              compact
              onPress={() => {
                setStartHour(h);
                setStartMinute(m);
              }}>
              {formatTime(h, m)}
            </Button>
          ))}
        </View>
        <List.Item
          title={`End: ${formatTime(endHour, endMinute)}`}
          description="When to stop monitoring (e.g., 10:00 AM)"
        />
        <View style={styles.presetRow}>
          {[
            [8, 0],
            [9, 0],
            [10, 0],
            [11, 0],
          ].map(([h, m]) => (
            <Button
              key={`e-${h}`}
              mode={endHour === h ? 'contained' : 'outlined'}
              compact
              onPress={() => {
                setEndHour(h);
                setEndMinute(m);
              }}>
              {formatTime(h, m)}
            </Button>
          ))}
        </View>

        <Text style={styles.sectionLabel}>Notify me X minutes before arrival</Text>
        <View style={styles.minutesRow}>
          {[1, 3, 5, 10].map((m) => (
            <Button
              key={m}
              mode={minutesBefore === m ? 'contained' : 'outlined'}
              compact
              onPress={() => setMinutesBefore(m)}>
              {m} min
            </Button>
          ))}
        </View>
      </ScrollView>
      <View style={styles.formActions}>
        <Button onPress={() => setStep(2)}>Back</Button>
        <Button mode="contained" onPress={handleSave} disabled={saving}>
          Save
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 80,
  },
  empty: {
    padding: 24,
    textAlign: 'center',
    color: '#666',
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
  },
  form: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 24,
    maxHeight: '80%',
  },
  formTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  formScroll: {
    maxHeight: 300,
    marginBottom: 16,
  },
  formActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  daysRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  dayButton: {
    margin: 2,
  },
  presetRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 8,
  },
  minutesRow: {
    flexDirection: 'row',
    gap: 8,
  },
});

export default SettingsBusNotifications;
