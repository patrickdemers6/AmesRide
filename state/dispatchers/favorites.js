import localForage from 'localforage';

import { favoriteRoutesState, routesState } from '../atoms';

export const removeFavorite =
  ({ set }) =>
  (id) => {
    set(favoriteRoutesState, (f) => [...f.filter((fav) => fav !== id)]);

    set(routesState, (routes) => [
      ...routes.map((r) => (r.ID === id ? { ...r, favorite: false } : r)),
    ]);
  };

export const addFavorite =
  ({ set }) =>
  (id) => {
    set(favoriteRoutesState, (f) => {
      return [...f, id];
    });

    set(routesState, (routes) => {
      return [...routes.map((r) => (r.ID === id ? { ...r, favorite: true } : r))];
    });
  };

export const fetchFavorites =
  ({ set }) =>
  () => {
    localForage.getItem('favorites').then((savedValue) => {
      set(favoriteRoutesState, savedValue != null ? JSON.parse(savedValue) : []);
    });
  };
