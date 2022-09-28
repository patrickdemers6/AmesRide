import getFromLocalStorage from '../localforage/getFromLocalStorage';
import jsonFetch from '../network/jsonFetch';

const getRoutes = async () => {
  const existingRoutes = await getFromLocalStorage('routes');
  if (existingRoutes) return { routes: existingRoutes, sorted: true };

  return jsonFetch('/Region/0/Routes').then((routes) => ({ routes, sorted: false }));
};

export default getRoutes;
