import React from 'react';
import { Image, Platform, StyleSheet, View } from 'react-native';
import { Marker } from 'react-native-maps';

import busImage from '../../../../assets/arrow.png';

/**
 * Show a single vehicle on the map.
 * Android draws the native image, which MapMarker scales to 25dp. A custom
 * child there is snapshotted before the PNG paints, so the arrow never shows.
 * Apple Maps does the opposite: it ignores Marker rotation, and an image-only
 * marker has no layout size, so nothing is drawn. A sized child paints there.
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

  if (typeof details?.position?.bearing === 'undefined') return null;

  const coordinate = { latitude, longitude };

  if (Platform.OS === 'ios') {
    return (
      <Marker coordinate={coordinate} zIndex={100} anchor={centerOfImage} tracksViewChanges>
        <View style={[styles.iconContainer, { transform: [{ rotate: `${bearing || 0}deg` }] }]}>
          <Image style={styles.icon} source={busImage} />
        </View>
      </Marker>
    );
  }

  return (
    <Marker
      coordinate={coordinate}
      zIndex={100}
      anchor={centerOfImage}
      rotation={bearing || 0}
      image={busImage}
    />
  );
};

const centerOfImage = { x: 0.5, y: 0.5 };

const styles = StyleSheet.create({
  iconContainer: {
    width: 25,
    height: 25,
  },
  icon: {
    width: '100%',
    height: '100%',
  },
});

export default React.memo(VehicleView);
