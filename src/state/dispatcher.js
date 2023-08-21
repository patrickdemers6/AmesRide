import { useRecoilCallback } from 'recoil';

import { setData, fetchData } from './dispatchers/data';
import { fetchFavoriteStops, toggleFavoriteStop } from './dispatchers/favoriteStops';
import { addFavorite, removeFavorite, fetchFavorites } from './dispatchers/favorites';
import { setLoading } from './dispatchers/loading';
import { updateCurrentRoute } from './dispatchers/routes';
import { clearCurrentStop, setCurrentStop, setUpcomingArrivals } from './dispatchers/stops';
import { setUserLocation } from './dispatchers/userLocation';
import { fetchUserSettings, toggleUserSetting } from './dispatchers/userSettings';
import { setVehicleLocations } from './dispatchers/vehicles';

export const createDispatcher = () => {
  const methods = {
    updateCurrentRoute,
    setVehicleLocations,
    addFavorite,
    removeFavorite,
    fetchFavorites,
    clearCurrentStop,
    setCurrentStop,
    setUpcomingArrivals,
    setUserLocation,
    fetchUserSettings,
    toggleUserSetting,
    fetchFavoriteStops,
    toggleFavoriteStop,
    setLoading,
    setData,
    fetchData,
  };

  Object.keys(methods).forEach((key) => {
    methods[key] = useRecoilCallback(methods[key]);
  });

  return methods;
};
