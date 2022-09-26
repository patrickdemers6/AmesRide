import { Polyline } from 'react-native-maps';

const RouteLine = ({ route }) => {
  return (
    <Polyline
      coordinates={route.waypoints || []}
      strokeColor={route.Color || '#000000'}
      strokeWidth={5}
    />
  );
};

export default RouteLine;
