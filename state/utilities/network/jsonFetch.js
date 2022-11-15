const CYRIDE_URL = 'https://www.mycyride.com';

const jsonFetch = async (path, options = {}) => {
  if (!isValidPath(path)) throw new Error(`invalid path, received ${path}`);

  const result = await fetch(CYRIDE_URL + path, {
    method: 'GET',
    cache: 'no-cache',
    ...options,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
  return result.json();
};

const isValidPath = (path) => {
  return path.match(/^\/[/.a-zA-Z0-9-]+$/);
};

export default jsonFetch;
