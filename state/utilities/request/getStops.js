import jsonFetch from '../network/jsonFetch';

const getStops = (routeID, stopID) => {
  return jsonFetch(`/Route/${routeID}/Direction/${stopID}/Stops`);
};

export default getStops;
