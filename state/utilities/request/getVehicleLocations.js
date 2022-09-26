import jsonFetch from '../network/jsonFetch';

const getVehicleLocations = (routeID) => {
  if (!routeID) return null;

  return jsonFetch(`/Route/${routeID}/Vehicles`);
};

export default getVehicleLocations;
