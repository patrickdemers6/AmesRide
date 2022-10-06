import { selector } from 'recoil';

import {
  currentRouteRowState,
  currentStopState,
  favoriteRoutesState,
  favoriteStopsState,
  routesState,
  upcomingArrivalsState,
} from './atoms';

export const currentRoute = selector({
  key: 'currentRoute',
  get: ({ get }) => {
    const allRoutes = get(routesState);
    const currentRoute = get(currentRouteRowState);

    if (!allRoutes || !currentRoute) {
      return { index: 0 };
    }

    return { ...allRoutes[currentRoute.row], index: currentRoute };
  },
});

export const favoriteRoutesOnlyState = selector({
  key: 'favoriteRoutesOnlyState',
  get: ({ get }) => {
    const routes = get(routesState);
    const favorites = get(favoriteRoutesState);
    if (!favorites) return [];
    return routes.filter((r) => favorites.includes(r.ID));
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

    return favoriteStops.has(currentStop.ID);
  },
});
