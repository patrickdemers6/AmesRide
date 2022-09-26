import { addFavorite, removeFavorite, fetchFavorites } from './dispatchers/favorites';
import { fetchRoutes, updateCurrentRoute } from './dispatchers/routes';
import { clearCurrentStop, setCurrentStop, fetchUpcomingStops } from './dispatchers/stops';
import { setUserLocation } from './dispatchers/userLocation';
import { updateVehicleLocations } from './dispatchers/vehicles';

export const createDispatcher = () => {
  return {
    fetchRoutes,
    updateCurrentRoute,
    updateVehicleLocations,
    addFavorite,
    removeFavorite,
    fetchFavorites,
    clearCurrentStop,
    setCurrentStop,
    fetchUpcomingStops,
    setUserLocation,
  };
};
