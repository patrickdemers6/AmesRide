import localForage from 'localforage';

import { favoriteRoutesState, routesState } from '../atoms';
import getFromLocalStorage from '../utilities/localforage/getFromLocalStorage';

export const removeFavorite =
  ({ set }) =>
  (id) => {
    set(favoriteRoutesState, (f) => [...f.filter((fav) => fav !== id)]);

    set(routesState, (routes) => [
      ...routes.map((r) => (r.ID === id ? { ...r, favorite: false } : r)),
    ]);
  };

export const addFavorite =
  ({ set, snapshot }) =>
  async (id) => {
    const routes = await snapshot.getLoadable(routesState).contents;

    set(favoriteRoutesState, (f) => {
      const newFavorites = [...f, id];
      return sortFavorites(newFavorites, routes);
    });

    set(routesState, (routes) => {
      return [...routes.map((r) => (r.ID === id ? { ...r, favorite: true } : r))];
    });
  };

const sortFavorites = (favorites, routes) => {
  const idToIndex = {};
  routes.forEach((route, i) => (idToIndex[route.ID] = i));
  return favorites.sort((a, b) => idToIndex[a] - idToIndex[b]);
};

export const fetchFavorites =
  ({ set }) =>
  async () => {
    const favorites = await getFromLocalStorage('favorites');
    set(favoriteRoutesState, favorites || []);
  };
