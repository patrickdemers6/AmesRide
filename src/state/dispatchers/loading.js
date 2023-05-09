import { loadingVehiclesState } from '../atoms';

export const setLoading =
  ({ set }) =>
  (isLoading) => {
    set(loadingVehiclesState, isLoading);
  };
