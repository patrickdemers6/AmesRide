import {
  currentRouteRowState,
  currentStopState,
  upcomingArrivalsState,
  vehicleLocationState,
  vehicleLocationWaitingState,
} from '../atoms';

export const updateCurrentRoute =
  ({ set }) =>
  async (route, clearCurrentStop = true) => {
    set(currentRouteRowState, route);
    set(vehicleLocationState, null);

    if (route < 0) return;

    set(vehicleLocationWaitingState, true);

    if (clearCurrentStop) {
      set(upcomingArrivalsState, null);
      set(currentStopState, null);
    }
  };
