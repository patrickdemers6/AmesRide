import { vehicleLocationState } from '../atoms';
import getVehicleLocations from '../utilities/request/getVehicleLocations';

export const updateVehicleLocations =
  ({ set }) =>
  async (routeID) => {
    if (!routeID) return;

    const vehicleLocations = await getVehicleLocations(routeID);

    set(vehicleLocationState, (current) => determineUpdatedValue(current, vehicleLocations));
  };

const NO_VEHICLES_FOUND = [];
const VEHICLES_LOADING = null;

const hasVehicles = (vehicles) => {
  return vehicles.length > 0;
};

/**
 * Determines the new state for vehicleLocationsState.
 *
 * if new vehicles -> new vehicles;
 * else if was loading -> no vehicles;
 * else -> use existing vehicles;
 *
 * @param existingVehicleLocations vehicle locations prior to fetch
 * @param updatedVehicleLocations vehicle locations from fetch
 * @returns {*[]|*} updated vehicle locations state
 */
const determineUpdatedValue = (existingVehicleLocations, updatedVehicleLocations) => {
  if (hasVehicles(updatedVehicleLocations)) return updatedVehicleLocations;

  if (existingVehicleLocations === VEHICLES_LOADING) return NO_VEHICLES_FOUND;

  return existingVehicleLocations;
};
