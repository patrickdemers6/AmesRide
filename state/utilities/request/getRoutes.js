import jsonFetch from '../network/jsonFetch';

const getRoutes = async () => {
  const routes = await jsonFetch('/Region/0/Routes');

  const result = {};
  routes.forEach((route) => {
    result[route.ID] = route;
  });
  return result;
};

export default getRoutes;
