import React from 'react';
import { Platform, ToastAndroid } from 'react-native';
import Toast from 'react-native-root-toast';
import { useRecoilValue } from 'recoil';

import { vehicleLocationState } from '../../../state/atoms';
import { isIndividualRoute } from '../../../state/selectors';
import VehicleView from './VehicleView';

const Vehicles = () => {
  const vehicles = useRecoilValue(vehicleLocationState);
  const isRegularRoute = useRecoilValue(isIndividualRoute);

  React.useEffect(() => {
    if (vehicles === null || vehicles.length > 0) return;
    Toast.show('No busses found on route.', {
      duration: Toast.durations.SHORT,
      position: Toast.positions.BOTTOM,
      shadow: true,
      animation: true,
      hideOnPress: true,
      delay: 0,
    });
  }, [vehicles]);

  if (!isRegularRoute) return null;

  return vehicles?.map((v) => <VehicleView key={v.ID} details={v} />);
};

export default React.memo(Vehicles);
