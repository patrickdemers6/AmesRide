import { userLocationState } from '../atoms';

export const setUserLocation =
  ({ set }) =>
  (location) => {
    set(userLocationState, location);
  };
