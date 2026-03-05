import React from 'react';
import {
  Alert,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput as RNTextInput,
  View,
} from 'react-native';
import { Button, Divider, FAB, IconButton, List, Text, TextInput } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
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
import theme from '../../styles/theme';
import ColorCircle from '../ColorCircle';

const R = theme.roundness;

const DIALOG_HEIGHT = 740;
const DIALOG_MAX_WIDTH_STEP1 = 380;
const DIALOG_MAX_WIDTH_STEP2 = 600;
const DIALOG_MAX_WIDTH_STEP3 = 600;
const DIALOG_MIN_WIDTH_STEP2 = 480;

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function to12(h24) {
  return { hour12: h24 % 12 || 12, ampm: h24 >= 12 ? 'PM' : 'AM' };
}
function to24(h12, ampm) {
  return (h12 % 12) + (ampm === 'PM' ? 12 : 0);
}
function fmtTime(h24, m) {
  const { hour12, ampm } = to12(h24);
  return `${hour12}:${m.toString().padStart(2, '0')} ${ampm}`;
}

const AmPmSegment = ({ value, onChange }) => (
  <View style={ampmSt.row}>
    {['AM', 'PM'].map((v) => (
      <Pressable
        key={v}
        onPress={() => onChange(v)}
        style={[ampmSt.btn, value === v && ampmSt.btnOn]}>
        <Text style={[ampmSt.txt, value === v && ampmSt.txtOn]}>{v}</Text>
      </Pressable>
    ))}
  </View>
);

const ampmSt = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
    marginTop: 10,
  },
  btn: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: R * 2,
    backgroundColor: theme.colors.background,
  },
  btnOn: { backgroundColor: theme.colors.primary },
  txt: { fontSize: 12, fontWeight: '500', color: theme.colors.text },
  txtOn: { color: theme.colors.onPrimary },
});

const TimeSide = ({ label, hour12, minute, ampm, onChange }) => {
  const [hText, setHText] = React.useState(String(hour12));
  const [mText, setMText] = React.useState(minute.toString().padStart(2, '0'));

  React.useEffect(() => setHText(String(hour12)), [hour12]);
  React.useEffect(() => setMText(minute.toString().padStart(2, '0')), [minute]);

  const commitH = () => {
    const h = parseInt(hText, 10);
    if (h >= 1 && h <= 12) onChange(h, minute, ampm);
    else setHText(String(hour12));
  };

  const commitM = () => {
    const m = parseInt(mText, 10);
    if (!isNaN(m) && m >= 0 && m <= 59) onChange(hour12, m, ampm);
    else setMText(minute.toString().padStart(2, '0'));
  };

  return (
    <View style={{ flex: 1, alignItems: 'center', paddingVertical: 14, paddingHorizontal: 10 }}>
      <Text style={timeSt.label}>{label}</Text>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3, marginTop: 10 }}>
        <RNTextInput
          value={hText}
          onChangeText={setHText}
          onBlur={commitH}
          keyboardType="number-pad"
          maxLength={2}
          selectTextOnFocus
          style={timeSt.box}
        />
        <Text style={timeSt.colon}>:</Text>
        <RNTextInput
          value={mText}
          onChangeText={setMText}
          onBlur={commitM}
          keyboardType="number-pad"
          maxLength={2}
          selectTextOnFocus
          style={timeSt.box}
        />
      </View>
      <AmPmSegment value={ampm} onChange={(v) => onChange(hour12, minute, v)} />
    </View>
  );
};

const timeSt = StyleSheet.create({
  label: { fontSize: 10, fontWeight: '700', letterSpacing: 0.8, color: theme.colors.text },
  box: {
    width: 46,
    height: 46,
    backgroundColor: theme.colors.surface,
    borderRadius: R * 2,
    borderWidth: 1,
    borderColor: theme.colors.placeholder,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '600',
    color: theme.colors.onSurface,
  },
  colon: {
    fontSize: 20,
    fontWeight: '300',
    color: theme.colors.text,
    marginBottom: 2,
  },
});

const TimePickerCard = ({ sh, sm, sa, eh, em, ea, onChangeStart, onChangeEnd }) => (
  <View style={tpcSt.row}>
    <View style={tpcSt.side}>
      <TimeSide label="FROM" hour12={sh} minute={sm} ampm={sa} onChange={onChangeStart} />
    </View>
    <View style={tpcSt.side}>
      <TimeSide label="TO" hour12={eh} minute={em} ampm={ea} onChange={onChangeEnd} />
    </View>
  </View>
);

const tpcSt = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 10,
  },
  side: {
    flex: 1,
    backgroundColor: theme.colors.background,
    borderRadius: R * 3,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: theme.colors.placeholder,
  },
});

const DAY_ROWS = [[1, 2], [3, 4], [5, 6], [0]];

const DayRow = ({ daysOfWeek, onToggle }) => (
  <View style={{ gap: 8 }}>
    {DAY_ROWS.map((row, ri) => (
      <View key={ri} style={row.length === 1 ? daySt.rowCentered : daySt.row}>
        {row.map((i) => {
          const on = daysOfWeek.includes(i);
          return (
            <Pressable
              key={i}
              onPress={() => onToggle(i)}
              style={[
                row.length === 1 ? daySt.btnSingle : daySt.btn,
                on ? daySt.btnOn : daySt.btnOff,
              ]}>
              <Text style={[daySt.lbl, on && daySt.lblOn]}>{DAY_NAMES[i]}</Text>
            </Pressable>
          );
        })}
      </View>
    ))}
  </View>
);

const daySt = StyleSheet.create({
  row: { flexDirection: 'row', gap: 8 },
  rowCentered: { flexDirection: 'row', justifyContent: 'center' },
  btn: {
    flex: 1,
    height: 36,
    borderRadius: R * 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnSingle: {
    flex: 0,
    width: '48%',
    height: 36,
    borderRadius: R * 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnOn: { backgroundColor: theme.colors.primary },
  btnOff: { borderWidth: 1.5, borderColor: theme.colors.placeholder },
  lbl: { fontSize: 13, fontWeight: '500', color: theme.colors.text },
  lblOn: { fontWeight: '600', color: theme.colors.onPrimary },
});

const MinuteStepper = ({ value, onChange }) => (
  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
    <IconButton
      icon="minus"
      size={18}
      mode="outlined"
      disabled={value <= 1}
      onPress={() => onChange(Math.max(1, value - 1))}
    />
    <View style={{ alignItems: 'center', width: 90 }}>
      <Text
        style={{ fontSize: 26, fontWeight: '600', color: theme.colors.onSurface, lineHeight: 32 }}>
        {value}
      </Text>
      <Text style={{ fontSize: 11, color: theme.colors.text, marginTop: -2 }}>
        {value === 1 ? 'minute' : 'minutes'} before
      </Text>
    </View>
    <IconButton
      icon="plus"
      size={18}
      mode="outlined"
      disabled={value >= 30}
      onPress={() => onChange(Math.min(30, value + 1))}
    />
  </View>
);

const SLabel = ({ children }) => (
  <Text
    style={{
      fontSize: 10,
      fontWeight: '700',
      letterSpacing: 0.7,
      textTransform: 'uppercase',
      color: theme.colors.text,
      marginBottom: 10,
      marginTop: 24,
    }}>
    {children}
  </Text>
);

const DialogHeader = ({ title, step, onClose }) => (
  <View style={hdrSt.row}>
    <View>
      <Text style={hdrSt.title}>{title}</Text>
      {step != null && <Text style={hdrSt.step}>Step {step}</Text>}
    </View>
    <Pressable onPress={onClose} hitSlop={12} style={hdrSt.closeBtn}>
      <Text style={hdrSt.closeX}>✕</Text>
    </Pressable>
  </View>
);

const hdrSt = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 14,
  },
  title: { fontSize: 17, fontWeight: '600', color: theme.colors.onSurface },
  step: { fontSize: 12, color: theme.colors.text, marginTop: 2 },
  closeBtn: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: theme.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeX: { fontSize: 11, color: theme.colors.text, fontWeight: '700' },
});

const DialogShell = ({ children, maxWidth }) => (
  <View style={[shellSt.dialog, maxWidth != null && { maxWidth }]}>{children}</View>
);

const shellSt = StyleSheet.create({
  dialog: {
    backgroundColor: theme.colors.surface,
    borderRadius: R * 4,
    width: '100%',
    height: DIALOG_HEIGHT,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.18,
    shadowRadius: 30,
    elevation: 14,
  },
});

const SettingsBusNotifications = () => {
  const insets = useSafeAreaInsets();
  const data = useRecoilValue(dataState);
  const routes = useRecoilValue(routesSortedState);
  const [notifications, setNotifications] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [showAddForm, setShowAddForm] = React.useState(false);
  const [editingNotification, setEditingNotification] = React.useState(null);

  const loadNotifications = React.useCallback(async () => {
    try {
      setNotifications(await getScheduledNotifications());
    } catch (e) {
      console.warn('Failed to load notifications:', e);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  const handleClose = () => {
    setShowAddForm(false);
    setEditingNotification(null);
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background, paddingBottom: 80 }}>
      <ScrollView>
        {loading ? (
          <Text style={{ color: theme.colors.text, textAlign: 'center', padding: 16 }}>
            Loading…
          </Text>
        ) : notifications.length === 0 ? (
          <View style={{ padding: 32, alignItems: 'center', gap: 8 }}>
            <Text style={{ fontSize: 15, fontWeight: '600', color: theme.colors.text }}>
              No notifications yet
            </Text>
            <Text
              style={{
                fontSize: 13,
                color: theme.colors.text,
                textAlign: 'center',
                lineHeight: 19,
              }}>
              Add one to get notified before your bus arrives.
            </Text>
          </View>
        ) : (
          notifications.map((n) => (
            <NotificationItem
              key={n.id}
              notification={n}
              data={data}
              onDelete={() => {
                Alert.alert(
                  'Delete notification?',
                  `Remove alert for ${n.routeName} at ${n.stopName}?`,
                  [
                    { text: 'Cancel', style: 'cancel' },
                    {
                      text: 'Delete',
                      style: 'destructive',
                      onPress: async () => {
                        try {
                          await deleteScheduledNotification(n.id);
                          loadNotifications();
                        } catch (e) {
                          Alert.alert('Error', 'Failed to delete notification. Please try again.');
                        }
                      },
                    },
                  ]
                );
              }}
              onEdit={(notif) => setEditingNotification(notif)}
            />
          ))
        )}
      </ScrollView>

      <FAB
        icon="plus"
        label="Add notification"
        variant="primary"
        onPress={() => {
          setEditingNotification(null);
          setShowAddForm(true);
        }}
        style={{
          position: 'absolute',
          right: 20,
          bottom: 20 + insets.bottom,
        }}
      />

      <Modal
        visible={showAddForm || !!editingNotification}
        animationType="fade"
        transparent
        onRequestClose={handleClose}>
        <Pressable
          style={{
            flex: 1,
            backgroundColor: theme.colors.backdrop,
            justifyContent: 'center',
            alignItems: 'center',
            padding: 20,
          }}
          onPress={handleClose}>
          <Pressable onPress={() => {}}>
            <AddNotificationForm
              data={data}
              routes={routes}
              editing={editingNotification}
              onSave={async () => {
                handleClose();
                loadNotifications();
              }}
              onCancel={handleClose}
            />
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
};

const NotificationItem = ({ notification, data, onDelete, onEdit }) => {
  const daysStr = (notification.daysOfWeek || []).map((d) => DAY_NAMES[d]).join(' · ');
  const timeStr = `${fmtTime(notification.startHour, notification.startMinute)} – ${fmtTime(
    notification.endHour,
    notification.endMinute
  )}`;
  const route = data?.routes?.[notification.routeId];
  const routeColor = route ? `#${route.route_color}` : '#888';
  const description = `at ${notification.stopName}\n${daysStr}\n${timeStr} · ${notification.minutesBefore} min before`;

  return (
    <List.Item
      title={notification.routeName}
      description={description}
      descriptionNumberOfLines={4}
      onPress={() => onEdit(notification)}
      titleStyle={{ fontWeight: '600', color: theme.colors.onSurface }}
      descriptionStyle={{ color: theme.colors.text }}
      left={() => (
        <ColorCircle size={24} color={routeColor} style={{ marginLeft: 16, marginVertical: 12 }} />
      )}
      right={() => (
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <IconButton icon="pencil" size={20} onPress={() => onEdit(notification)} />
          <IconButton icon="delete" size={20} iconColor={theme.colors.error} onPress={onDelete} />
        </View>
      )}
      style={{ backgroundColor: theme.colors.surface }}
    />
  );
};

const AddNotificationForm = ({ data, routes, editing, onSave, onCancel }) => {
  const initStart = to12(editing?.startHour ?? 8);
  const initEnd = to12(editing?.endHour ?? 10);

  const [stopId, setStopId] = React.useState(editing?.stopId ?? null);
  const [routeId, setRouteId] = React.useState(editing?.routeId ?? null);
  const [daysOfWeek, setDaysOfWeek] = React.useState(editing?.daysOfWeek ?? [1, 2, 3, 4, 5]);
  const [startHour12, setStartHour12] = React.useState(initStart.hour12);
  const [startMinute, setStartMinute] = React.useState(editing?.startMinute ?? 0);
  const [startAmpm, setStartAmpm] = React.useState(initStart.ampm);
  const [endHour12, setEndHour12] = React.useState(initEnd.hour12);
  const [endMinute, setEndMinute] = React.useState(editing?.endMinute ?? 0);
  const [endAmpm, setEndAmpm] = React.useState(initEnd.ampm);
  const [minutesBefore, setMinutesBefore] = React.useState(editing?.minutesBefore ?? 5);
  const [saving, setSaving] = React.useState(false);
  const [step, setStep] = React.useState(editing ? 3 : 1);
  const [stopSearch, setStopSearch] = React.useState('');

  const stops = data?.stops ? Object.values(data.stops) : [];
  const filteredStops = stopSearch.trim()
    ? stops.filter((s) => s.stop_name.toLowerCase().includes(stopSearch.trim().toLowerCase()))
    : stops;

  const toggleDay = (d) =>
    setDaysOfWeek((prev) => (prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d].sort()));

  const handleSave = async () => {
    if (!stopId || !routeId) return;
    setSaving(true);
    try {
      const ok = await setupNotifications();
      if (!ok) {
        Alert.alert(
          'Permission required',
          'Please enable notifications for AmesRide in your device settings.'
        );
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
        startHour: to24(startHour12, startAmpm),
        startMinute,
        endHour: to24(endHour12, endAmpm),
        endMinute,
        minutesBefore,
      };
      editing
        ? await updateScheduledNotification(editing.id, config)
        : await addScheduledNotification(config);
      onSave();
    } catch (e) {
      console.warn('Failed to save notification:', e);
      Alert.alert('Error', 'Failed to save notification. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const selectedStop = stopId ? data?.stops?.[stopId] : null;
  const selectedRoute = routeId ? data?.routes?.[routeId] : null;

  // Footer shared across all steps
  const footer = (backAction, backLabel) => (
    <>
      <Divider />
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingHorizontal: 12,
          paddingVertical: 8,
        }}>
        <Button onPress={backAction} textColor={theme.colors.text}>
          {backLabel}
        </Button>
        {step === 3 && (
          <Button
            mode="contained"
            onPress={handleSave}
            disabled={saving || !stopId || !routeId}
            buttonColor={theme.colors.primary}
            textColor={theme.colors.onPrimary}>
            {saving ? 'Saving…' : 'Save'}
          </Button>
        )}
      </View>
    </>
  );

  if (step === 1) {
    return (
      <DialogShell maxWidth={DIALOG_MAX_WIDTH_STEP1}>
        <DialogHeader title="Choose a stop" step="1 of 3" onClose={onCancel} />
        <Divider />
        <TextInput
          mode="outlined"
          placeholder="Search stops…"
          value={stopSearch}
          onChangeText={setStopSearch}
          dense
          style={{ margin: 14, marginBottom: 6 }}
          left={<TextInput.Icon icon="magnify" />}
        />
        <ScrollView style={{ flex: 1 }} keyboardShouldPersistTaps="handled">
          {filteredStops.length === 0 ? (
            <Text style={{ color: theme.colors.text, textAlign: 'center', padding: 16 }}>
              No stops match.
            </Text>
          ) : (
            filteredStops.map((s) => (
              <Pressable
                key={s.stop_id}
                onPress={() => {
                  setStopId(s.stop_id);
                  setStep(2);
                }}
                style={{
                  paddingVertical: 13,
                  paddingHorizontal: 20,
                  borderBottomWidth: StyleSheet.hairlineWidth,
                  borderBottomColor: theme.colors.placeholder,
                }}>
                <Text style={{ fontSize: 15, color: theme.colors.onSurface }}>{s.stop_name}</Text>
              </Pressable>
            ))
          )}
        </ScrollView>
        {footer(onCancel, 'Cancel')}
      </DialogShell>
    );
  }

  if (step === 2) {
    return (
      <DialogShell minWidth={DIALOG_MIN_WIDTH_STEP2} maxWidth={DIALOG_MAX_WIDTH_STEP2}>
        <DialogHeader title="Choose a route" step="2 of 3" onClose={onCancel} />
        {selectedStop && (
          <Text
            style={{
              fontSize: 12,
              color: theme.colors.text,
              paddingHorizontal: 20,
              paddingBottom: 8,
            }}>
            {selectedStop.stop_name}
          </Text>
        )}
        <Divider />
        <ScrollView style={{ flex: 1 }}>
          {(routes || []).map((r) => (
            <Pressable
              key={r.route_id}
              onPress={() => {
                setRouteId(r.route_id);
                setStep(3);
              }}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 12,
                paddingVertical: 13,
                paddingHorizontal: 20,
                borderBottomWidth: StyleSheet.hairlineWidth,
                borderBottomColor: theme.colors.placeholder,
              }}>
              <ColorCircle size={22} color={`#${r.route_color}`} />
              <Text style={{ fontSize: 15, color: theme.colors.onSurface, flex: 1 }}>
                {r.route_long_name}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
        {footer(() => setStep(1), 'Back')}
      </DialogShell>
    );
  }

  const routeColor = `#${(selectedRoute || {}).route_color || 'ccc'}`;

  return (
    <DialogShell maxWidth={DIALOG_MAX_WIDTH_STEP3}>
      <DialogHeader
        title="Configure Schedule"
        step={editing ? null : '3 of 3'}
        onClose={onCancel}
      />
      <Divider />
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 20, paddingTop: 16 }}
        showsVerticalScrollIndicator={false}>
        {(selectedStop || editing?.stopName) && (selectedRoute || editing?.routeName) && (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 10,
              backgroundColor: theme.colors.background,
              borderRadius: R * 2,
              paddingHorizontal: 12,
              paddingVertical: 10,
              marginBottom: 4,
            }}>
            <ColorCircle size={16} color={routeColor} />
            <View style={{ flex: 1 }}>
              <Text
                style={{ fontSize: 14, fontWeight: '600', color: theme.colors.onSurface }}
                numberOfLines={1}>
                {selectedRoute?.route_long_name || editing?.routeName}
              </Text>
              <Text style={{ fontSize: 12, color: theme.colors.text }} numberOfLines={1}>
                {selectedStop?.stop_name || editing?.stopName}
              </Text>
            </View>
          </View>
        )}

        <SLabel>Days</SLabel>
        <DayRow daysOfWeek={daysOfWeek} onToggle={toggleDay} />

        <SLabel>Monitoring Window</SLabel>
        <TimePickerCard
          sh={startHour12}
          sm={startMinute}
          sa={startAmpm}
          eh={endHour12}
          em={endMinute}
          ea={endAmpm}
          onChangeStart={(h, m, ap) => {
            setStartHour12(h);
            setStartMinute(m);
            setStartAmpm(ap);
          }}
          onChangeEnd={(h, m, ap) => {
            setEndHour12(h);
            setEndMinute(m);
            setEndAmpm(ap);
          }}
        />

        <SLabel>Alert Timing</SLabel>
        <MinuteStepper value={minutesBefore} onChange={setMinutesBefore} />
      </ScrollView>
      {footer(editing ? onCancel : () => setStep(2), editing ? 'Cancel' : 'Back')}
    </DialogShell>
  );
};

export default SettingsBusNotifications;
