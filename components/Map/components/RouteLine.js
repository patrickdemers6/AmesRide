import { Polyline } from 'react-native-maps';
import { useRecoilValue } from 'recoil';

import { routesState } from '../../../state/atoms';

const RouteLine = ({ route }) => {
  let stops = [];
  const routes = useRecoilValue(routesState);
  if (route.ID === -2) return null;

  if (route.ID === -1) {
    stops = Object.values(routes);
  } else {
    stops = [route];
  }

  return stops.map((route, i) => (
    <Polyline
      key={i}
      coordinates={route.waypoints || []}
      strokeColor={route.Color || '#000000'}
      strokeWidth={5}
    />
  ));
};

export default RouteLine;
