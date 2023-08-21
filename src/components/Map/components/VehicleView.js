import React from 'react';
import { Image, View, StyleSheet } from 'react-native';
import { Marker } from 'react-native-maps';

import busImage from '../../../../assets/arrow.png';

/**
 * Show a single vehicle on the map.
 */
const VehicleView = ({ details }) => {
  // bearing may be undefined momentarily when vehicle is first activated on a route
  const [bearing, setBearing] = React.useState(null);

  const { latitude, longitude, speed } = details.position;

  React.useEffect(() => {
    /*
      always update bearing if no bearing is defined for the vehicle
      
      do not adjust bearing if bearing was reported previously but vehicle is not moving
      vehicle has gyroscope on it which can return random directions when stopped
      */
    if (details.position.bearing && (bearing === null || speed > 3))
      setBearing(details.position.bearing);
  }, [details]);

  if (typeof details?.position?.bearing === 'undefined') return;

  return (
    <Marker
      coordinate={{
        latitude,
        longitude,
      }}
      zIndex={100}
      anchor={centerOfImage}>
      <View style={[styles.iconContainer, { transform: [{ rotate: `${bearing || 0}deg` }] }]}>
        <Image style={styles.icon} source={busImage} />
      </View>
    </Marker>
  );
};

const centerOfImage = { x: 0.5, y: 0.5 };

const styles = StyleSheet.create({
  iconContainer: {
    width: 25,
    height: 25,
    transformOrigin: 'center',
  },
  icon: {
    width: '100%',
    height: '100%',
    zIndex: 100,
  },
});

export default React.memo(VehicleView);
