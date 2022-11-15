import localForage from 'localforage';

const getFromLocalStorage = async (key) => {
  let savedValue;
  try {
    savedValue = await localForage.getItem(key);
  } catch (e) {
    console.log(e);
    return;
  }
  if (savedValue) {
    return JSON.parse(savedValue);
  }
};

export const getSetFromLocalStorage = async (key) => {
  let savedValue;
  try {
    savedValue = await localForage.getItem(key);
  } catch (e) {
    console.log(e);
    return new Set();
  }

  if (savedValue) {
    const jsonArray = JSON.parse(savedValue);
    return new Set(jsonArray);
  }

  return new Set();
};

export default getFromLocalStorage;
