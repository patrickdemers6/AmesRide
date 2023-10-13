import { selector } from 'recoil';

import {
  currentRouteRowState,
  currentStopState,
  dataState,
  favoriteRoutesState,
  favoriteStopsState,
  upcomingArrivalsState,
  vehicleLocationState,
} from './atoms';
import { ALL_ROUTES } from './constants';

/**
 * Get information about the current route.
 * Returns an object with only route_id for non-individual routes.
 */
export const currentRoute = selector({
  key: 'currentRoute',
  get: ({ get }) => {
    const allRoutes = get(dataState);
    const currentRoute = get(currentRouteRowState);

    if (currentRoute < 0) {
      return { route_id: currentRoute };
    }

    if (!allRoutes || !currentRoute) {
      return { route_id: -1 };
    }

    return { ...allRoutes.routes[currentRoute] };
  },
});

export const routesSortedState = selector({
  key: 'routesSortedState',
  get: ({ get }) => {
    const data = get(dataState);
    if (!data?.routes) return null;
    return Object.values(data.routes)
      .sort(sortRoutes)
      .filter((route) => Boolean(route.trips));
  },
});

export const favoriteRoutesOnlyState = selector({
  key: 'favoriteRoutesOnlyState',
  get: ({ get }) => {
    const data = get(dataState);
    const favoriteRouteIds = get(favoriteRoutesState);

    if (!favoriteRouteIds || !data?.routes) return [];

    const favorites = [];
    favoriteRouteIds.forEach((routeId) => {
      // routeId used to be a number. ignore these
      if (typeof routeId !== 'string' || !data.routes[routeId]) return;
      favorites.push(data.routes[routeId]);
    });

    return favorites.sort(sortRoutes);
  },
});

export const upcomingArrivalsSorted = selector({
  key: 'upcomingArrivalsSorted',
  get: ({ get }) => {
    const upcomingArrivals = get(upcomingArrivalsState);
    return upcomingArrivals;
  },
});

export const isCurrentStopFavorite = selector({
  key: 'isCurrentStopFavorite',
  get: ({ get }) => {
    const currentStop = get(currentStopState);
    const favoriteStops = get(favoriteStopsState);

    if (!currentStop) return false;

    return favoriteStops.has(currentStop.stop_id);
  },
});

export const favoriteStopDetailsState = selector({
  key: 'favoriteStopDetailsState',
  get: ({ get }) => {
    const favoriteStopIds = get(favoriteStopsState);
    const data = get(dataState);

    if (!data?.stops) return null;

    // favoriteStopIds is a set with IDs. get the data for each stop
    return Array.from(favoriteStopIds).map((stopId) => data.stops[stopId]);
  },
});

/**
 * Get details of each stop on the current trip.
 */
export const stopsInCurrentTripSelector = selector({
  key: 'stopsInCurrentTripSelector',
  get: ({ get }) => {
    const currentRouteID = get(currentRouteRowState);
    const currentTrip = get(currentTripSelector);
    const data = get(dataState);

    if (!data?.stops) return null;

    if (currentRouteID === ALL_ROUTES) {
      return Object.values(data.stops);
    }

    if (!currentTrip) return null;

    // trip.stops only stores the stop_ids, need to map to data
    return currentTrip.stops.map((stopId) => data.stops[stopId]);
  },
});

/**
 * Returns true if this is a fake route (favorites, all routes, etc).
 */
export const isCustomRouteSelector = selector({
  key: 'isCustomRouteSelector',
  get: ({ get }) => {
    const currentRouteID = get(currentRouteRowState);

    // currentRouteID is below zero for custom routes
    return currentRouteID < 0;
  },
});

export const currentRouteShapeSelector = selector({
  key: 'currentPatternSelector',
  get: ({ get }) => {
    /**
     * goal: get the shape of the current route
     */
    const vehicles = get(vehicleLocationState);
    const route = get(currentRoute);
    const data = get(dataState);

    // no pattern when on favorites or all routes
    if (route < 0) return null;

    if (vehicles && vehicles.length > 0) {
      // get the pattern based on the vehicles
      return data.trips[vehicles[0].trip].shape_id;
    }

    // if we don't have trips for this route, it is impossible to render a route
    if (!route.trips) return null;

    // no busses are loaded, get any trip's line
    return data.trips[route.trips[0]].shape_id;
  },
});

export const currentTripSelector = selector({
  key: 'currentTripSelector',
  get: ({ get }) => {
    /**
     * goal: get the current trip
     */
    const vehicles = get(vehicleLocationState);
    const route = get(currentRoute);
    const data = get(dataState);

    // no pattern when on favorites or all routes
    if (route < 0) return null;

    if (vehicles && vehicles.length > 0) {
      // get the pattern based on the vehicles
      return data.trips[vehicles[0].trip];
    }

    // if we don't have trips for this route, it is impossible to render a route
    if (!route.trips) return null;

    // no busses are loaded, get any trip's line
    return data.trips[route.trips[0]];
  },
});

const sortRoutes = (a, b) => {
  const regex = /^[0-9]+/;
  const aIsNumber = regex.test(a.route_short_name);
  const bIsNumber = regex.test(b.route_short_name);
  if (aIsNumber && !bIsNumber) return -1;
  if (!aIsNumber && bIsNumber) return 1;
  if (!aIsNumber && !bIsNumber) {
    return a.route_long_name < b.route_long_name ? -1 : 1;
  }

  const aNum = Number.parseInt(a.route_short_name, 10);
  const bNum = Number.parseInt(b.route_short_name, 10);

  if (aNum > bNum) return 1;
  if (aNum < bNum) return -1;

  if (['North', 'East'].some((dir) => a.route_long_name.includes(dir))) return -1;
  return 1;
};

/**
 * Does the current route have vehicles on it?
 */
export const routeHasVehiclesSelector = selector({
  key: 'routeHasVehiclesSelector',
  get: ({ get }) => {
    const vehicles = get(vehicleLocationState);

    return vehicles && vehicles.length > 0;
  },
});

/**
 * Is the application waiting to receive vehicle data for current route?
 */
export const isWaitingForVehicleDataSelector = selector({
  key: 'isWaitingForVehicleDataSelector',
  get: ({ get }) => {
    const vehicles = get(vehicleLocationState);

    return vehicles === null;
  },
});

export const isDataEmpty = selector({
  key: 'isDataEmptySelector',
  get: ({ get }) => {
    const data = get(dataState);
    return data.routes === null;
  },
});
