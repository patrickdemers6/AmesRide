import React from 'react';
import Toast from 'react-native-root-toast';
import { useRecoilValue } from 'recoil';

import VehicleView from './VehicleView';
import {
  currentRouteRowState,
  vehicleLocationState,
  vehicleLocationWaitingState,
} from '../../../state/atoms';
import { isCustomRouteSelector, routeHasVehiclesSelector } from '../../../state/selectors';

/**
 * Render all vehicles on the current route.
 */
const Vehicles = () => {
  const vehicleLocations = useRecoilValue(vehicleLocationState);
  const vehicleLocationsWaiting = useRecoilValue(vehicleLocationWaitingState);
  const route = useRecoilValue(currentRouteRowState);
  const isCustomRoute = useRecoilValue(isCustomRouteSelector);
  const routeHasVehicles = useRecoilValue(routeHasVehiclesSelector);
  const [hasReportedNoVehicles, setHasReportedNoVehicles] = React.useState(false);

  React.useEffect(() => {
    setHasReportedNoVehicles(false);
  }, [route]);

  React.useEffect(() => {
    if (!vehicleLocationsWaiting && !routeHasVehicles && !hasReportedNoVehicles && !isCustomRoute) {
      setHasReportedNoVehicles(true);
      Toast.show('No vehicles found on route.', toastOptions);
    } else if (routeHasVehicles) {
      setHasReportedNoVehicles(false);
    }
  }, [vehicleLocations]);

  // there are no busses on favorites or all routes
  if (isCustomRoute || !routeHasVehicles) return null;

  return vehicleLocations.map((v) => <VehicleView key={v.id} details={v} />);
};

const toastOptions = {
  duration: Toast.durations.SHORT,
  position: Toast.positions.BOTTOM,
  shadow: true,
  animation: true,
  hideOnPress: true,
  delay: 0,
};

export default React.memo(Vehicles);
