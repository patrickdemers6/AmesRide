import React from 'react';
import { Modal, StyleSheet, View } from 'react-native';
import { Button, Text } from 'react-native-paper';

import { scheduleQuickNotify } from '../../../services/notifications';

const MINUTE_OPTIONS = [1, 3, 5, 10];

const QuickNotifyModal = ({ visible, onDismiss, arrival, route, stop }) => {
  const [scheduling, setScheduling] = React.useState(false);

  const handleSelect = async (minutesBefore) => {
    if (!arrival || !route || !stop) return;
    setScheduling(true);
    try {
      const id = await scheduleQuickNotify({
        arrival,
        route,
        stop,
        minutesBefore,
      });
      if (id) {
        onDismiss();
      }
    } catch (e) {
      console.warn('Failed to schedule notification:', e);
    } finally {
      setScheduling(false);
    }
  };

  if (!arrival || !route || !stop) return null;

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.bubble}>
          <Text style={styles.title}>Notify me before arrival</Text>
          <Text style={styles.subtitle}>
            {route.route_long_name} at {stop.stop_name}
          </Text>
          <View style={styles.options}>
            {MINUTE_OPTIONS.map((mins) => (
              <Button
                key={mins}
                mode="contained"
                onPress={() => handleSelect(mins)}
                disabled={scheduling}
                style={styles.optionButton}>
                {mins} {mins === 1 ? 'minute' : 'minutes'} before
              </Button>
            ))}
          </View>
          <Button mode="text" onPress={onDismiss} disabled={scheduling}>
            Cancel
          </Button>
        </View>
      </View>
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
  bubble: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 320,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
  },
  options: {
    gap: 8,
    marginBottom: 8,
  },
  optionButton: {
    marginVertical: 4,
  },
});

export default QuickNotifyModal;
