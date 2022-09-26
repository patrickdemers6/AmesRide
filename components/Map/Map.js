import * as Location from 'expo-location';
import React, { useRef } from 'react';
import { View, Dimensions } from 'react-native';
import MapView from 'react-native-maps';
import { useRecoilValue } from 'recoil';

import { dispatcherState, userLocationState } from '../../state/atoms';
import { currentRoute } from '../../state/selectors';
import RouteLine from './components/RouteLine';
import Stops from './components/Stops';
import Vehicles from './components/Vehicles';

const { width, height } = Dimensions.get('window');

const Map = () => {
  const route = useRecoilValue(currentRoute);
  const location = useRecoilValue(userLocationState);
  const dispatcher = useRecoilValue(dispatcherState);

  const mapRef = useRef(null);

  React.useEffect(() => {
    const interval = fetchVehiclesOnInterval(route, dispatcher);
    return () => clearInterval(interval);
  }, [route]);

  React.useEffect(() => {
    (async () => {
      const location = await Location.getCurrentPositionAsync();
      dispatcher?.setUserLocation(location);
    })();
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
    dispatcher?.setStop(stop);
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
        rotateEnabled={false}>
        <RouteLine route={route} />
        <Stops stops={route.stops} onPress={setStop} />
        <Vehicles />
      </MapView>
    </View>
  );
};

const fetchVehiclesOnInterval = (route, dispatcher) => {
  const fetchVehicle = () => dispatcher?.updateVehicleLocations(route.ID);
  fetchVehicle();

  return setInterval(fetchVehicle, 5000);
};

export default Map;
