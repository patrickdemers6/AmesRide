import { useRecoilCallback } from 'recoil';

import { userLocationState } from '../atoms';

/*  eslint react-hooks/rules-of-hooks: "off" */

export const setUserLocation = useRecoilCallback(({ set }) => (location) => {
  set(userLocationState, location);
});
