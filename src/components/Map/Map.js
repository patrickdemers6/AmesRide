import React, { useRef } from 'react';
import { View, Dimensions } from 'react-native';
import MapView from 'react-native-maps';
import { useRecoilValue } from 'recoil';

import isInServiceBoundary from '../../data/serviceBoundaries';
import { currentStopState, dispatcherState, userLocationState } from '../../state/atoms';
import { currentRoute } from '../../state/selectors';
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
  const location = useRecoilValue(userLocationState);
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
        <Stops />
        <Vehicles />
      </MapView>
    </View>
  );
};

export default Map;
