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
    let routes;
    try {
      routes = await getRoutes();
    } catch (e) {
      console.error(e);
      return;
    }

    if (Object.keys(routes).length === 0) return;

    set(routesState, routes);

    const routePatterns = {};
    Object.values(routes).forEach((route) => {
      route.Patterns.forEach((pattern) => {
        routePatterns[pattern.ID] = route.ID;
      });
    });
    set(routePatternsState, routePatterns);

    const promises = [];
    for (const route of Object.values(routes)) {
      promises.push(updateStops(routes, route.ID, set));
      promises.push(updateWaypoints(routes, route.ID, set));
    }
    await Promise.all(promises);
  };

export const updateCurrentRoute =
  ({ set, snapshot }) =>
  async (route, clearCurrentStop = true) => {
    set(currentRouteRowState, route);
    set(vehicleLocationState, null);

    if (route < 0) return;

    if (clearCurrentStop) {
      set(upcomingArrivalsState, null);
      set(currentStopState, null);
    }

    const routes = await snapshot.getLoadable(routesState).contents;

    await updateWaypoints(routes, route, set);
    await updateStops(routes, route, set);
  };

const updateWaypoints = async (routes, route, set) => {
  if (routes[route].waypoints) return;
  let waypoints;
  try {
    waypoints = await getWaypoints(route);
  } catch (e) {
    console.error(e);
    return;
  }
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
  if (routes[route].stops) return;
  let stops;
  try {
    stops = await getStops(routes[route].Patterns[0].ID, route);
  } catch (e) {
    console.error(e);
    return;
  }

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
