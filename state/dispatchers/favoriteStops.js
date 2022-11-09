import { favoriteStopsState } from '../atoms';
import { getSetFromLocalStorage } from '../utilities/localforage/getFromLocalStorage';

export const removeFavoriteStop =
  ({ set }) =>
  (id) => {
    set(favoriteStopsState, (f) => {
      f.remove(id);
      return new Set(f);
    });
  };

export const addFavoriteStop =
  ({ set }) =>
  async (id) => {
    set(favoriteStopsState, (f) => {
      f.add(id);
      return new Set(f);
    });
  };

export const fetchFavoriteStops =
  ({ set }) =>
  async () => {
    const favoritesArray = await getSetFromLocalStorage('favorite-stops');
    set(favoriteStopsState, favoritesArray);
  };

export const toggleFavoriteStop =
  ({ set }) =>
  (id) => {
    set(favoriteStopsState, (favoriteStops) => {
      if (favoriteStops.has(id)) favoriteStops.delete(id);
      else favoriteStops.add(id);
      return new Set(favoriteStops);
    });
  };
