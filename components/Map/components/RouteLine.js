import React from 'react';
import { Polyline } from 'react-native-maps';
import { useRecoilValue } from 'recoil';

import { routesState } from '../../../state/atoms';
import { ALL_ROUTES, FAVORITE_ROUTES } from '../../../state/constants';

const RouteLine = ({ route }) => {
  let stops = [];
  const routes = useRecoilValue(routesState);

  if (route.ID === FAVORITE_ROUTES) return null;

  if (route.ID === ALL_ROUTES) {
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

export default React.memo(RouteLine);
