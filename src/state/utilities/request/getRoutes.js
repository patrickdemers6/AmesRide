import getFromLocalStorage from '../localforage/getFromLocalStorage';
import jsonFetch from '../network/jsonFetch';

const getRoutes = async () => {
  const cachedRoutes = await getFromLocalStorage('routes-1');
  if (cachedRoutes) {
    return cachedRoutes;
  }

  const routes = await jsonFetch('/Region/0/Routes');

  const result = {};
  routes.forEach((route) => {
    result[route.ID] = route;
  });
  return result;
};

export default getRoutes;
