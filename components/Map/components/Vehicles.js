import React from 'react';
import { ToastAndroid } from 'react-native';
import { useRecoilValue } from 'recoil';

import { vehicleLocationState } from '../../../state/atoms';
import VehicleView from './VehicleView';

const Vehicles = () => {
  const vehicles = useRecoilValue(vehicleLocationState);

  React.useEffect(() => {
    if (vehicles === null || vehicles.length > 0) return;
    ToastAndroid.show('No busses found on route.', ToastAndroid.SHORT);
  }, [vehicles]);

  return vehicles?.map((v) => <VehicleView key={v.ID} details={v} />);
};

export default Vehicles;
