import { Image, View } from 'react-native';
import { Marker } from 'react-native-maps';

import busImage from '../../../assets/arrow.png';

const VehicleView = ({ details }) => {
  const transformMarkerDegrees = calculateMarkerRotation(details);
  return (
    <Marker
      coordinate={{
        latitude: details.Coordinate.Latitude,
        longitude: details.Coordinate.Longitude,
      }}
      zIndex={100}
      anchor={{ x: 0.5, y: 0.5 }}>
      <View
        style={{
          width: 25,
          height: 25,
          transformOrigin: 'center',
          transform: [{ rotate: `${transformMarkerDegrees}deg` }],
        }}>
        <Image style={{ width: '100%', height: '100%', zIndex: 100 }} source={busImage} />
      </View>
    </Marker>
  );
};

const calculateMarkerRotation = (vehicle) => {
  // east is the direction before rotation
  switch (vehicle.Heading) {
    case 'N':
      return 270;
    case 'NE':
      return 315;
    case 'E':
      return 0;
    case 'SE':
      return 45;
    case 'S':
      return 90;
    case 'SW':
      return 135;
    case 'W':
      return 180;
    case 'NW':
      return 225;
  }

  return 0;
};

export default VehicleView;
