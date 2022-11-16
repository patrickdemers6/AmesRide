import React from 'react';
import { ToastAndroid } from 'react-native';
import { useRecoilValue } from 'recoil';

import { vehicleLocationState } from '../../../state/atoms';
import { isIndividualRoute } from '../../../state/selectors';
import VehicleView from './VehicleView';

const Vehicles = () => {
  const vehicles = useRecoilValue(vehicleLocationState);
  const isRegularRoute = useRecoilValue(isIndividualRoute);

  React.useEffect(() => {
    if (vehicles === null || vehicles.length > 0) return;
    ToastAndroid.show('No busses found on route.', ToastAndroid.SHORT);
  }, [vehicles]);

  if (!isRegularRoute) return null;

  return vehicles?.map((v) => <VehicleView key={v.ID} details={v} />);
};

export default React.memo(Vehicles);
