import * as Location from 'expo-location';
import React, { useRef } from 'react';
import { View, Dimensions, AppState } from 'react-native';
import MapView from 'react-native-maps';
import { useRecoilValue } from 'recoil';

import isInServiceBoundary from '../../data/serviceBoundaries';
import { currentStopState, dispatcherState, userLocationState } from '../../state/atoms';
import { currentRoute } from '../../state/selectors';
import RouteLine from './components/RouteLine';
import Stops from './components/Stops';
import Vehicles from './components/Vehicles';

const FETCH_BUS_SECONDS_INTERVAL = 5000;

const isuCampusRegion = {
  latitude: 42.02663,
  longitude: -93.6466,
  latitudeDelta: 0.01,
  longitudeDelta: 0.01,
};

const Map = () => {
  const route = useRecoilValue(currentRoute);
  const location = useRecoilValue(userLocationState);
  const dispatcher = useRecoilValue(dispatcherState);
  const currentStop = useRecoilValue(currentStopState);
  const [screen, setScreen] = React.useState(Dimensions.get('window'));

  // when user rotates screen, update dimensions of map
  Dimensions.addEventListener('change', () => {
    setScreen(Dimensions.get('window'));
  });

  const mapRef = useRef(null);

  const handleMapPress = () => {
    if (currentStop) dispatcher?.clearCurrentStop();
  };

  const updateVehiclesOnForeground = () => {
    const fetchVehiclesInterval = fetchVehiclesOnInterval(route, dispatcher);

    // fetch bus arrivals when app comes back into foreground
    const appToForegroundSubscription = AppState.addEventListener('change', (nextAppState) => {
      if (nextAppState === 'active') {
        fetchVehicle(route, dispatcher);
      }
    });

    return () => {
      clearInterval(fetchVehiclesInterval);
      appToForegroundSubscription.remove();
    };
  };

  const moveMapToUser = () => {
    if (!location) return;

    const { latitude, longitude } = location.coords;

    if (isInServiceBoundary(latitude, longitude)) {
      mapRef.current.animateToRegion({
        latitude,
        longitude,
        longitudeDelta: 0.01,
        latitudeDelta: 0.01,
      });
    }
  };

  React.useEffect(updateVehiclesOnForeground, [route]);
  React.useEffect(moveMapToUser, [location]);

  return (
    <View style={{ width: screen.width, height: screen.height }}>
      <MapView
        style={{ width: screen.width, height: screen.height }}
        initialRegion={isuCampusRegion}
        showsUserLocation
        onPress={handleMapPress}
        moveOnMarkerPress={false}
        ref={mapRef}
        showsCompass={false}
        rotateEnabled={false}
        toolbarEnabled={false}
        showsIndoorLevelPicker={false}
        showsIndoors={false}
        showsTraffic={false}>
        <RouteLine route={route} />
        <Stops stops={route.stops} />
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
