import React from 'react';
import { Polyline } from 'react-native-maps';
import { useRecoilValue } from 'recoil';

import { dataState } from '../../../state/atoms';
import { ALL_ROUTES, FAVORITE_ROUTES } from '../../../state/constants';
import { currentRouteShapeSelector } from '../../../state/selectors';

const RouteLine = ({ route }) => {
  let routes = [];
  const data = useRecoilValue(dataState);
  const currentRouteShape = useRecoilValue(currentRouteShapeSelector);

  if (!data || !data.routes || !data.shapes || !data.trips) return;

  if (route.route_id === FAVORITE_ROUTES) return null;

  if (route.route_id === ALL_ROUTES) {
    const seenRouteWaypoints = new Set();
    Object.values(data.trips).forEach((trip) => {
      const key = data.routes[trip.route_id].route_id;
      if (seenRouteWaypoints.has(key)) return;
      seenRouteWaypoints.add(key);
      routes.push({
        waypoints: data.shapes[trip.shape_id]?.map((a) => ({
          latitude: a.latitude,
          longitude: a.longitude,
        })),
        route: data.routes[trip.route_id],
      });
    });
  } else {
    if (!currentRouteShape) return null;
    routes = [
      {
        waypoints: data.shapes[currentRouteShape]?.map((a) => ({
          latitude: a.latitude,
          longitude: a.longitude,
        })),
        route,
      },
    ];
  }
  return routes.map((route, i) => {
    return (
      <Polyline
        key={i}
        coordinates={route.waypoints}
        strokeColor={`#${route.route.route_color}` || '#000000'}
        strokeWidth={5}
      />
    );
  });
};

export default React.memo(RouteLine);
