import jsonFetch from '../network/jsonFetch';

const getArrivals = (stopID) => {
  return jsonFetch(`/Stop/${stopID}/Arrivals`);
};

export default getArrivals;
