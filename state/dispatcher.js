import localForage from 'localforage';
import { useRecoilCallback } from 'recoil';

import {
  currentRouteRowState,
  currentStopState,
  favoriteRoutesState,
  routesState,
  upcomingArrivalsState,
  userLocationState,
  vehicleLocationState,
} from './atoms';

const DECIMAL_RADIX = 10;

/*  eslint react-hooks/rules-of-hooks: "off" --
    useRecoilCallback is a hook, but isn't actually called until using dispatcher inside a react component
    therefore use of hook in this instance is justified
*/

export const createDispatcher = () => {
  const fetchRoutes = useRecoilCallback(({ set, snapshot }) => () => {
    fetch('https://www.mycyride.com/Region/0/Routes', {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
      .then((result) => result.json())
      .then(async (json) => {
        json.sort(
          (a, b) =>
            Number.parseInt(a.DisplayName.split(' ')[0], DECIMAL_RADIX) -
            Number.parseInt(b.DisplayName.split(' ')[0], DECIMAL_RADIX)
        );

        const favorites = await snapshot.getLoadable(favoriteRoutesState).contents;

        if (favorites)
          json = json.map((route) => ({ ...route, favorite: favorites.includes(route.ID) }));

        if (json.length > 0) set(routesState, [...json]);
      })
      .catch(console.log);
  });

  const updateCurrentRoute = useRecoilCallback(
    ({ set, snapshot }) =>
      (route, clearCurrentStop = true) => {
        set(currentRouteRowState, { ...route });

        if (clearCurrentStop) {
          set(upcomingArrivalsState, null);
          set(currentStopState, null);
        }

        const routes = snapshot.getLoadable(routesState).contents;

        if (!routes[route.row].waypoints) {
          fetch(`https://www.mycyride.com/Route/${routes[route.row].ID}/Waypoints`, {
            method: 'GET',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
          })
            .then((result) => result.json())
            .then((json) => {
              let wp = json[0];
              if (wp.length > 0) {
                wp = wp.map((w) => ({ latitude: w.Latitude, longitude: w.Longitude }));
                set(routesState, (rs) => {
                  const updated = [...rs];
                  updated[route.row] = { ...updated[route.row], waypoints: wp };
                  return updated;
                });
              }
            })
            .catch(console.log);
        }

        if (!routes[route.row].stops) {
          fetch(
            `https://www.mycyride.com/Route/${routes[route.row].Patterns[0].ID}/Direction/${
              routes[route.row].ID
            }/Stops`,
            {
              method: 'GET',
              headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
              },
            }
          )
            .then((result) => result.json())
            .then((json) => {
              set(routesState, (rs) => {
                const updated = [...rs];
                updated[route.row] = { ...updated[route.row], stops: json };
                return updated;
              });
            })
            .catch(console.log);
        }
      }
  );

  const updateVehicleLocations = useRecoilCallback(({ set }) => (id) => {
    if (!id) return;

    fetch(`https://www.mycyride.com/Route/${id}/Vehicles`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
      .then((result) => result.json())
      .then((json) => {
        // if received new vehicles, update to them
        // else if vl is null, set to empty array (to signify no vehicles)
        // else there are already vehicles, leave alone
        set(vehicleLocationState, (vl) => (json.length > 0 ? json : vl === null ? [] : vl));
      })
      .catch(console.log);
  });

  const removeFavorite = useRecoilCallback(({ set }) => (id) => {
    set(favoriteRoutesState, (f) => [...f.filter((fav) => fav !== id)]);

    set(routesState, (routes) => [
      ...routes.map((r) => (r.ID === id ? { ...r, favorite: false } : r)),
    ]);
  });

  const addFavorite = useRecoilCallback(({ set }) => (id) => {
    set(favoriteRoutesState, (f) => {
      return [...f, id];
    });

    set(routesState, (routes) => {
      return [...routes.map((r) => (r.ID === id ? { ...r, favorite: true } : r))];
    });
  });

  const fetchFavorites = useRecoilCallback(({ set }) => () => {
    localForage.getItem('favorites').then((savedValue) => {
      set(favoriteRoutesState, savedValue != null ? JSON.parse(savedValue) : []);
    });
  });

  const clearCurrentStop = useRecoilCallback(({ set }) => () => {
    set(currentStopState, null);
  });

  const setStop = useRecoilCallback(({ set }) => (stop) => {
    set(currentStopState, { ...stop });
  });

  const fetchUpcomingStops = useRecoilCallback(({ set }) => (stop) => {
    set(upcomingArrivalsState, []);
    fetch(`https://www.mycyride.com/Stop/${stop.ID}/Arrivals`)
      .then((result) => result.json())
      .then((json) => {
        set(upcomingArrivalsState, json);
      });
  });

  const setUserLocation = useRecoilCallback(({ set }) => (location) => {
    set(userLocationState, location);
  });

  return {
    fetchRoutes,
    updateCurrentRoute,
    updateVehicleLocations,
    addFavorite,
    removeFavorite,
    fetchFavorites,
    clearCurrentStop,
    setStop,
    fetchUpcomingStops,
    setUserLocation,
  };
};
