import * as Location from 'expo-location';
import React, { useRef } from 'react';
import { View, Dimensions, AppState } from 'react-native';
import MapView from 'react-native-maps';
import { useRecoilValue } from 'recoil';

import { dispatcherState, userLocationState } from '../../state/atoms';
import { currentRoute } from '../../state/selectors';
import RouteLine from './components/RouteLine';
import Stops from './components/Stops';
import Vehicles from './components/Vehicles';

const { width, height } = Dimensions.get('window');

const FETCH_BUS_SECONDS_INTERVAL = 5000;

const Map = () => {
  const route = useRecoilValue(currentRoute);
  const location = useRecoilValue(userLocationState);
  const dispatcher = useRecoilValue(dispatcherState);

  const mapRef = useRef(null);

  React.useEffect(() => {
    const interval = fetchVehiclesOnInterval(route, dispatcher);

    // fetch bus arrivals when app comes back into foreground
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (nextAppState === 'active') {
        fetchVehicle(route, dispatcher);
      }
    });

    return () => {
      clearInterval(interval);
      subscription.remove();
    };
  }, [route]);

  React.useEffect(() => {
    (async () => {
      const location = await Location.getCurrentPositionAsync();
      dispatcher?.setUserLocation(location);
    })().catch(() => {
      console.log('No location permissions granted.');
    });
  }, []);

  React.useEffect(() => {
    if (!location) return;

    mapRef.current.animateToRegion({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      longitudeDelta: 0.01,
      latitudeDelta: 0.01,
    });
  }, [location]);

  const setStop = (stop) => {
    dispatcher?.setCurrentStop(stop);
  };

  return (
    <View style={{ width, height }}>
      <MapView
        style={{ width, height }}
        initialRegion={{
          latitude: 42.02663,
          longitude: -93.6466,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        showsUserLocation
        onPress={dispatcher?.clearCurrentStop}
        moveOnMarkerPress={false}
        ref={mapRef}
        showsCompass={false}
        rotateEnabled={false}
        toolbarEnabled={false}
        showsIndoorLevelPicker={false}
        showsIndoors={false}
        showsTraffic={false}>
        <RouteLine route={route} />
        <Stops stops={route.stops} onPress={setStop} />
        <Vehicles />
      </MapView>
    </View>
  );
};

const fetchVehicle = (route, dispatcher) => dispatcher?.updateVehicleLocations(route.ID);

const fetchVehiclesOnInterval = (route, dispatcher) => {
  fetchVehicle(route, dispatcher);

  return setInterval(() => fetchVehicle(route, dispatcher), FETCH_BUS_SECONDS_INTERVAL);
};

export default Map;
