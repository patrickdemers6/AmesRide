import DateTimePicker from '@react-native-community/datetimepicker';
import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import MapView, { MapCircle } from 'react-native-maps';
import { Button, Dialog, List, Portal, Text } from 'react-native-paper';
import { useRecoilValue } from 'recoil';

import { currentRuleState, dispatcherState } from '../../../state/atoms';
import { routesSortedState } from '../../../state/selectors';
import { isuCampusRegion } from '../../Map/locations';

const styles = StyleSheet.create({
  left: {
    marginTop: 'auto',
    marginBottom: 'auto',
    marginLeft: 8,
    fontSize: 16,
  },
  right: {
    marginTop: 'auto',
    marginBottom: 'auto',
    fontSize: 14,
    color: 'grey',
  },
});

const RouteDisplay = ({ routeName }) => (
  <Text style={styles.right}>{routeName || 'Select a Route'}</Text>
);

const CreateRule = ({ navigation }) => {
  const [showSelectRoute, setShowSelectRoute] = React.useState(false);
  const [showSelectStartTime, setShowSelectStartTime] = React.useState(false);

  const [showSelectEndTime, setShowSelectEndTime] = React.useState(false);
  const routes = useRecoilValue(routesSortedState);
  const state = useRecoilValue(currentRuleState);
  const dispatcher = useRecoilValue(dispatcherState);
  React.useEffect(() => {
    dispatcher.setCurrentRule({
      time: { start: null, end: null },
      location: null,
      stop: null,
      route: null,
    });
  }, []);

  const openTime = () => {
    setShowSelectStartTime(true);
  };

  const openSelectStop = () => {
    navigation.push('Settings/CreateRule/SelectStop');
  };

  const selectRoute = (route) => {
    dispatcher.updateCurrentRule('route', route);
    setShowSelectRoute(false);
  };

  const doneSelectRoute = () => {
    setShowSelectRoute(false);
  };

  const setStartTime = (event, time) => {
    setShowSelectStartTime(false);
    setShowSelectEndTime(true);
    if (event.type === 'set') {
      dispatcher.updateCurrentRule('time.start', time);
    }
  };
  const setEndTime = (event, time) => {
    setShowSelectEndTime(false);
    if (event.type === 'set') {
      dispatcher.updateCurrentRule('time.end', time);
    }
  };

  const formatAMPM = (date) => {
    let hours = date.getHours();
    let minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0' + minutes : minutes;
    const strTime = hours + ':' + minutes + ' ' + ampm;
    return strTime;
  };

  const formatTime = (time) => {
    return `${formatAMPM(time.start)} - ${formatAMPM(time.end)}`;
  };

  return (
    <View style={{ margin: 8 }}>
      <Text />
      <List.Item
        onPress={openTime}
        left={() => <Text style={styles.left}>Time</Text>}
        right={() => (
          <Text style={styles.right}>
            {state?.time?.start && state.time.end ? formatTime(state.time) : 'Select a Time'}
          </Text>
        )}
      />
      <List.Item
        onPress={() => {}}
        title="Location"
        description={() => (
          <View style={{ borderRadius: 16, overflow: 'hidden', paddingTop: 8 }}>
            <MapView
              initialRegion={isuCampusRegion}
              zoomControlEnabled={false}
              zoomEnabled={false}
              pitchEnabled={false}
              rotateEnabled={false}
              scrollEnabled={false}
              toolbarEnabled={false}
              showsIndoorLevelPicker={false}
              showsCompass={false}
              showsIndoors={false}
              showsMyLocationButton={false}
              showsScale={false}
              showsTraffic={false}
              showsUserLocation={false}
              zoomTapEnabled={false}
              style={{ height: 200, width: '100%' }}>
              <MapCircle center={isuCampusRegion} radius={100} fillColor="red" />
            </MapView>
          </View>
        )}
        // right={() => null}
      />
      <List.Subheader style={{ color: 'black', fontSize: 16 }}>Automatically Show</List.Subheader>
      <List.Item
        onPress={openSelectStop}
        left={() => <Text style={styles.left}>Stop</Text>}
        right={() => <Text style={styles.right}>{state.stop?.Name || 'Select a Stop'}</Text>}
      />
      <List.Item
        onPress={() => setShowSelectRoute(true)}
        left={() => <Text style={styles.left}>Route</Text>}
        right={() => <RouteDisplay routeName={state.route?.DisplayName} />}
      />

      <Portal>
        <Dialog visible={showSelectRoute} onDismiss={doneSelectRoute}>
          <Dialog.Title>Select a Route</Dialog.Title>
          <Dialog.Content style={{ maxHeight: 500 }}>
            <ScrollView style={{ maxHeight: 500 }}>
              <List.Item title="None" onPress={() => selectRoute(null)} />
              {routes.map((route) => (
                <List.Item title={route.DisplayName} onPress={() => selectRoute(route)} />
              ))}
            </ScrollView>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={doneSelectRoute}>Cancel</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      {showSelectStartTime ? (
        <DateTimePicker onChange={setStartTime} minuteInterval={5} mode="time" value={new Date()} />
      ) : null}
      {showSelectEndTime ? (
        <DateTimePicker
          minimumDate={state.time.start}
          onChange={setEndTime}
          minuteInterval={5}
          mode="time"
          value={new Date()}
        />
      ) : null}
    </View>
  );
};

export default CreateRule;
