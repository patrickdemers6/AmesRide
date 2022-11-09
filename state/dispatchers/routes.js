import {
  currentRouteRowState,
  currentStopState,
  routePatternsState,
  routesState,
  stopsState,
  upcomingArrivalsState,
  vehicleLocationState,
} from '../atoms';
import getRoutes from '../utilities/request/getRoutes';
import getStops from '../utilities/request/getStops';
import getWaypoints from '../utilities/request/getWaypoints';

export const fetchRoutes =
  ({ set }) =>
  async () => {
    const routes = await getRoutes();

    if (Object.keys(routes).length === 0) return;

    set(routesState, routes);

    const routePatterns = {};
    Object.values(routes).forEach((route) => {
      route.Patterns.forEach((pattern) => {
        routePatterns[pattern.ID] = route.ID;
      });
    });
    set(routePatternsState, routePatterns);
  };

export const updateCurrentRoute =
  ({ set, snapshot }) =>
  async (route, clearCurrentStop = true) => {
    set(currentRouteRowState, route);
    set(vehicleLocationState, null);

    if (route === -1) return;

    if (clearCurrentStop) {
      set(upcomingArrivalsState, null);
      set(currentStopState, null);
    }

    const routes = await snapshot.getLoadable(routesState).contents;

    await updateWaypoints(routes, route, set);
    await updateStops(routes, route, set);
  };

const updateWaypoints = async (routes, route, set) => {
  let waypoints = await getWaypoints(route);
  waypoints = waypoints[0];

  if (waypoints.length > 0) {
    waypoints = waypoints.map((w) => ({ latitude: w.Latitude, longitude: w.Longitude }));

    set(routesState, (rs) => {
      const updated = { ...rs };
      updated[route] = { ...updated[route], waypoints };
      return updated;
    });
  }
};

const updateStops = async (routes, route, set) => {
  const stops = await getStops(routes[route].Patterns[0].ID, route);

  set(routesState, (rs) => {
    const updated = { ...rs };
    updated[route] = { ...updated[route], stops: stops.map((s) => s.RtpiNumber) };
    return updated;
  });

  set(stopsState, (current) => {
    const toAdd = {};
    stops.forEach((stop) => {
      toAdd[stop.RtpiNumber] = stop;
    });

    return { ...current, ...toAdd };
  });
};
