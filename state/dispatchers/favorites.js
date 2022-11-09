import { favoriteRoutesState } from '../atoms';
import { getSetFromLocalStorage } from '../utilities/localforage/getFromLocalStorage';

export const removeFavorite =
  ({ set }) =>
  (id) => {
    set(favoriteRoutesState, (current) => {
      const updated = new Set(current);
      updated.delete(id);
      return updated;
    });
  };

export const addFavorite =
  ({ set }) =>
  async (id) => {
    set(favoriteRoutesState, (current) => {
      const updated = new Set(current);
      updated.add(id);
      return updated;
    });
  };

export const fetchFavorites =
  ({ set }) =>
  async () => {
    const favorites = await getSetFromLocalStorage('favorite-routes');
    set(favoriteRoutesState, favorites);
  };
