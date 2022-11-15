import React from 'react';
import { ToastAndroid } from 'react-native';
import { useRecoilValue } from 'recoil';

import { currentRouteRowState, vehicleLocationState } from '../../../state/atoms';
import VehicleView from './VehicleView';

const Vehicles = () => {
  const vehicles = useRecoilValue(vehicleLocationState);
  const currentRouteID = useRecoilValue(currentRouteRowState);

  React.useEffect(() => {
    if (vehicles === null || vehicles.length > 0) return;
    ToastAndroid.show('No busses found on route.', ToastAndroid.SHORT);
  }, [vehicles]);

  if (currentRouteID < 0) return null;

  return vehicles?.map((v) => <VehicleView key={v.ID} details={v} />);
};

export default Vehicles;
