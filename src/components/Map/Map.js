import * as Location from 'expo-location';
import React, { useRef } from 'react';
import { View, Dimensions } from 'react-native';
import MapView from 'react-native-maps';
import { useRecoilValue } from 'recoil';

import isInServiceBoundary from '../../data/serviceBoundaries';
import { currentStopState, dispatcherState } from '../../state/atoms';
import { currentRoute } from '../../state/selectors';
import MoveToLocation from './components/MoveToLocation';
import RouteLine from './components/RouteLine';
import Stops from './components/Stops';
import Vehicles from './components/Vehicles';

const isuCampusRegion = {
  latitude: 42.02663,
  longitude: -93.6466,
  latitudeDelta: 0.01,
  longitudeDelta: 0.01,
};

const Map = () => {
  const route = useRecoilValue(currentRoute);
  const [locationStatus, locationRequestPermission] = Location.useForegroundPermissions();
  const dispatcher = useRecoilValue(dispatcherState);
  const currentStop = useRecoilValue(currentStopState);
  const [screen, setScreen] = React.useState(Dimensions.get('window'));

  React.useEffect(() => {
    Dimensions.addEventListener('change', () => {
      setScreen(Dimensions.get('window'));
    });
  }, []);

  const mapRef = useRef(null);

  const handleMapPress = () => {
    if (currentStop) dispatcher?.clearCurrentStop();
  };

  const moveMapToUser = (force) => {
    if (!locationStatus?.granted) return;

    (async () => {
      const location = await Location.getLastKnownPositionAsync().catch(console.error);

      if (!location) return;

      const { latitude, longitude } = location.coords;

      if (force || isInServiceBoundary(latitude, longitude)) {
        mapRef.current.animateToRegion(
          {
            latitude,
            longitude,
            longitudeDelta: 0.01,
            latitudeDelta: 0.01,
          },
          300
        );
      }
    })();
  };
  React.useEffect(moveMapToUser, [locationStatus?.granted]);

  React.useEffect(() => {
    if (!locationStatus) return;

    const { granted, canAskAgain } = locationStatus;
    if (!granted && canAskAgain) {
      locationRequestPermission().catch(console.error);
    }
  }, [locationStatus]);

  return (
    <View style={{ width: screen.width, height: screen.height }}>
      <MapView
        style={{ width: screen.width, height: screen.height }}
        initialRegion={isuCampusRegion}
        showsUserLocation
        onPress={handleMapPress}
        showsMyLocationButton={false}
        moveOnMarkerPress={false}
        ref={mapRef}
        showsCompass={false}
        rotateEnabled={false}
        toolbarEnabled={false}
        showsIndoorLevelPicker={false}
        showsIndoors={false}
        showsTraffic={false}>
        <RouteLine route={route} />
        <Stops />
        <Vehicles />
      </MapView>
      <MoveToLocation onPress={() => moveMapToUser(true)} show={locationStatus?.granted} />
    </View>
  );
};

export default Map;
