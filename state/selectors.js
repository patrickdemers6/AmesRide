import { selector } from 'recoil';

import {
  currentRouteRowState,
  currentStopState,
  favoriteRoutesState,
  favoriteStopsState,
  routesState,
  stopsState,
  upcomingArrivalsState,
} from './atoms';

export const currentRoute = selector({
  key: 'currentRoute',
  get: ({ get }) => {
    const allRoutes = get(routesState);
    const currentRoute = get(currentRouteRowState);

    if (currentRoute === -1) {
      return { ID: -1 };
    }

    if (!allRoutes || !currentRoute) {
      return {};
    }

    return { ...allRoutes[currentRoute] };
  },
});

export const routesSortedState = selector({
  key: 'routesSortedState',
  get: ({ get }) => {
    const sortRoutes = (a, b) => {
      const difference = Number.parseInt(a.ShortName, 10) - Number.parseInt(b.ShortName, 10);

      if (difference !== 0) return difference;

      const directions = ['North', 'East', 'South', 'West'];
      const aDir = directions.some((dir) => a.DisplayName.endsWith(dir));
      const bDir = directions.some((dir) => b.DisplayName.endsWith(dir));
      if (aDir && bDir) return a.DisplayName.includes('West') || a.DisplayName.includes('South');

      return bDir;
    };

    const routes = get(routesState);
    return Object.values(routes).sort(sortRoutes);
  },
});

export const favoriteRoutesOnlyState = selector({
  key: 'favoriteRoutesOnlyState',
  get: ({ get }) => {
    const routes = get(routesSortedState);
    const favorites = get(favoriteRoutesState);

    if (!favorites) return [];
    const result = routes.filter((r) => favorites.has(r.ID));
    return result;
  },
});

export const upcomingArrivalsSorted = selector({
  key: 'upcomingArrivalsSorted',
  get: ({ get }) => {
    const upcomingArrivals = get(upcomingArrivalsState);
    if (!upcomingArrivals) return upcomingArrivals;

    const result = [];
    for (const route of upcomingArrivals) {
      for (const arrival of route.Arrivals) {
        result.push(arrival);
      }
    }
    return result.sort((a, b) => a.Minutes > b.Minutes);
  },
});

export const isCurrentStopFavorite = selector({
  key: 'isCurrentStopFavorite',
  get: ({ get }) => {
    const currentStop = get(currentStopState);
    const favoriteStops = get(favoriteStopsState);
    if (!currentStop) return false;

    return favoriteStops.has(currentStop.RtpiNumber);
  },
});

export const favoriteStopDetailsState = selector({
  key: 'favoriteStopDetailsState',
  get: ({ get }) => {
    const favoriteStopIDs = get(favoriteStopsState);
    const allStops = get(stopsState);

    if (Object.keys(allStops).length === 0) return null;

    const result = [];
    console.log({ favoriteStopIDs });
    for (const stopID of favoriteStopIDs.values()) {
      result.push(allStops[stopID]);
    }
    return result;
  },
});

export const currentRouteStopDetailsState = selector({
  key: 'currentRouteStopDetailsState',
  get: ({ get }) => {
    const allStops = get(stopsState);
    const currentRouteID = get(currentRouteRowState);
    const allRoutes = get(routesState);

    if (
      Object.keys(allStops).length === 0 ||
      currentRouteID === -1 ||
      Object.keys(allRoutes).length === 0 ||
      !allRoutes[currentRouteID]?.stops
    )
      return [];

    const result = [];
    for (const stopID of allRoutes[currentRouteID]?.stops) {
      if (allStops[stopID]) result.push(allStops[stopID]);
    }

    return result;
  },
});
