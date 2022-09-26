import jsonFetch from '../network/jsonFetch';

const getRoutes = () => {
  return jsonFetch('/Region/0/Routes');
};

export default getRoutes;
