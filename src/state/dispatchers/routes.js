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

  const result = {};

  waypoints.forEach((waypoint, i) => {
    waypoint = waypoint.map((w) => ({ latitude: w.Latitude, longitude: w.Longitude }));

    result[routes[route].Patterns[i].ID] = waypoint;
  });

  set(routesState, (rs) => {
    const updated = { ...rs };
    updated[route] = { ...updated[route], waypoints: result };
    return updated;
  });
};

const updateStops = async (routes, route, set) => {
  if (routes[route].stops) return;

  const promises = [];

  const allStops = {};
  const result = {};

  routes[route].Patterns.forEach((pattern) => {
    promises.push(
      (async () => {
        let stops;
        try {
          stops = await getStops(pattern.ID, route);
        } catch (e) {
          console.error(e);
          return;
        }
        result[pattern.ID] = stops.map((s) => s.RtpiNumber);
        stops.forEach((stop) => {
          allStops[stop.RtpiNumber] = stop;
        });
      })()
    );
  });

  await Promise.all(promises);

  set(routesState, (rs) => {
    const updated = { ...rs };
    updated[route] = {
      ...updated[route],
      stops: result,
    };
    return updated;
  });

  set(stopsState, (current) => {
    return { ...current, ...allStops };
  });
};
