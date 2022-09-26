import { currentStopState, upcomingArrivalsState } from '../atoms';
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
    const arrivals = await getArrivals(stop.ID);
    set(upcomingArrivalsState, arrivals);
  };
