import {
  currentRouteRowState,
  currentStopState,
  favoriteRoutesState,
  routesState,
  upcomingArrivalsState,
  vehicleLocationState,
} from '../atoms';
import getRoutes from '../utilities/request/getRoutes';
import getStops from '../utilities/request/getStops';
import getWaypoints from '../utilities/request/getWaypoints';

const DECIMAL_RADIX = 10;

export const fetchRoutes =
  ({ set, snapshot }) =>
  async () => {
    let routes = await getRoutes();

    if (routes.length === 0) return;

    routes.sort(sortRoutes);

    routes = await setFavoritesOnRoutes(routes, snapshot);

    set(routesState, [...routes]);
  };

export const updateCurrentRoute =
  ({ set, snapshot }) =>
  async (route, clearCurrentStop = true) => {
    set(currentRouteRowState, { ...route });
    set(vehicleLocationState, null);

    if (clearCurrentStop) {
      set(upcomingArrivalsState, null);
      set(currentStopState, null);
    }

    const routes = snapshot.getLoadable(routesState).contents;

    if (!routes[route.row].waypoints) await updateWaypoints(routes, route, set);

    if (!routes[route.row].stops) await updateStops(routes, route, set);
  };

const setFavoritesOnRoutes = async (routes, snapshot) => {
  const favorites = await snapshot.getLoadable(favoriteRoutesState).contents;
  let r = routes;
  if (favorites) r = r.map((route) => ({ ...route, favorite: favorites.includes(route.ID) }));
  return r;
};

const sortRoutes = (a, b) => {
  const difference =
    Number.parseInt(a.ShortName, DECIMAL_RADIX) - Number.parseInt(b.ShortName, DECIMAL_RADIX);

  if (difference !== 0) return difference;

  const directions = ['North', 'East', 'South', 'West'];
  const aDir = directions.some((dir) => a.DisplayName.endsWith(dir));
  const bDir = directions.some((dir) => b.DisplayName.endsWith(dir));
  if (aDir && bDir) return a.DisplayName.includes('West') || a.DisplayName.includes('South');

  return bDir;
};

const updateWaypoints = async (routes, route, set) => {
  let waypoints = await getWaypoints(routes[route.row].ID);
  waypoints = waypoints[0];

  if (waypoints.length > 0) {
    waypoints = waypoints.map((w) => ({ latitude: w.Latitude, longitude: w.Longitude }));

    set(routesState, (rs) => {
      const updated = [...rs];
      updated[route.row] = { ...updated[route.row], waypoints };
      return updated;
    });
  }
};

const updateStops = async (routes, route, set) => {
  const stops = await getStops(routes[route.row].Patterns[0].ID, routes[route.row].ID);

  set(routesState, (rs) => {
    const updated = [...rs];
    updated[route.row] = { ...updated[route.row], stops };
    return updated;
  });
};
