import jsonFetch from '../network/jsonFetch';

const getVehicleLocations = (routeID) => {
  if (routeID < 0) return null;

  return jsonFetch(`/Route/${routeID}/Vehicles`);
};

export default getVehicleLocations;
