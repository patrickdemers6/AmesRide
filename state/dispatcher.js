import { useRecoilCallback } from 'recoil';

import {
  addFavoriteStop,
  removeFavoriteStop,
  fetchFavoriteStops,
  toggleFavoriteStop,
} from './dispatchers/favoriteStops';
import { addFavorite, removeFavorite, fetchFavorites } from './dispatchers/favorites';
import { fetchRoutes, updateCurrentRoute } from './dispatchers/routes';
import { clearCurrentStop, setCurrentStop, fetchUpcomingArrivals } from './dispatchers/stops';
import { setUserLocation } from './dispatchers/userLocation';
import { fetchUserSettings, setUserSetting, toggleUserSetting } from './dispatchers/userSettings';
import { updateVehicleLocations } from './dispatchers/vehicles';

export const createDispatcher = () => {
  const methods = {
    fetchRoutes,
    updateCurrentRoute,
    updateVehicleLocations,
    addFavorite,
    removeFavorite,
    fetchFavorites,
    clearCurrentStop,
    setCurrentStop,
    fetchUpcomingArrivals,
    setUserLocation,
    fetchUserSettings,
    setUserSetting,
    toggleUserSetting,
    removeFavoriteStop,
    addFavoriteStop,
    fetchFavoriteStops,
    toggleFavoriteStop,
  };

  Object.keys(methods).forEach((key) => {
    methods[key] = useRecoilCallback(methods[key]);
  });

  return methods;
};
