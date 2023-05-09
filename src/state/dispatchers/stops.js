import {
  currentStopState,
  loadingArrivalsState,
  stopsState,
  upcomingArrivalsState,
} from '../atoms';
import getFromLocalStorage from '../utilities/localforage/getFromLocalStorage';
import getArrivals from '../utilities/request/getArrivals';

export const clearCurrentStop =
  ({ set }) =>
  () => {
    set(currentStopState, null);
  };

export const setCurrentStop =
  ({ set }) =>
  (stop) => {
    set(currentStopState, { ...stop });
  };

export const fetchUpcomingArrivals =
  ({ set }) =>
  async (stop) => {
    if (stop.ID < 0) return;
    set(loadingArrivalsState, true);
    const arrivals = await getArrivals(stop.ID);
    set(loadingArrivalsState, false);
    set(upcomingArrivalsState, arrivals);
  };

export const setUpcomingArrivals =
  ({ set, snapshot }) =>
  (websocketPayload) => {
    if (!websocketPayload) {
      set(upcomingArrivalsState, null);
      set(loadingArrivalsState, true);
      return;
    }

    const stopState = snapshot.getLoadable(currentStopState).contents;
    if (!stopState) return;
    const currentStopId = stopState.stop_id;

    if (currentStopId === websocketPayload.k) {
      set(upcomingArrivalsState, websocketPayload.data ?? []);
      set(loadingArrivalsState, false);
    }
  };

export const fetchStops =
  ({ set }) =>
  async () => {
    const stops = await getFromLocalStorage('stops-state');
    set(stopsState, stops || {});
  };
