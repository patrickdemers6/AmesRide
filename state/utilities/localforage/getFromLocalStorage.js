import localForage from 'localforage';

const getFromLocalStorage = (key) => {
  return localForage.getItem(key).then((savedValue) => {
    return JSON.parse(savedValue);
  });
};

export default getFromLocalStorage;
