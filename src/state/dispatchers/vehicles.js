import { vehicleLocationState, vehicleLocationWaitingState } from '../atoms';
import { currentRoute } from '../selectors';

export const setVehicleLocations =
  ({ set, snapshot }) =>
  async (websocketPayload) => {
    const currentRouteId = await snapshot.getLoadable(currentRoute).contents.route_id;

    if (currentRouteId === websocketPayload.k) {
      set(vehicleLocationState, websocketPayload.data ?? []);
      set(vehicleLocationWaitingState, false);
    }
  };
