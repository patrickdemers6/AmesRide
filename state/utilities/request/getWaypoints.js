import jsonFetch from '../network/jsonFetch';

const getWaypoints = (routeID) => {
  return jsonFetch(`/Route/${routeID}/Waypoints`);
};

export default getWaypoints;
