import localForage from 'localforage';
import { useRecoilCallback } from 'recoil';

import { favoriteRoutesState, routesState } from '../atoms';

/*  eslint react-hooks/rules-of-hooks: "off" */

export const removeFavorite = useRecoilCallback(({ set }) => (id) => {
  set(favoriteRoutesState, (f) => [...f.filter((fav) => fav !== id)]);

  set(routesState, (routes) => [
    ...routes.map((r) => (r.ID === id ? { ...r, favorite: false } : r)),
  ]);
});

export const addFavorite = useRecoilCallback(({ set }) => (id) => {
  set(favoriteRoutesState, (f) => {
    return [...f, id];
  });

  set(routesState, (routes) => {
    return [...routes.map((r) => (r.ID === id ? { ...r, favorite: true } : r))];
  });
});

export const fetchFavorites = useRecoilCallback(({ set }) => () => {
  localForage.getItem('favorites').then((savedValue) => {
    set(favoriteRoutesState, savedValue != null ? JSON.parse(savedValue) : []);
  });
});
