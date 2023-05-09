import { dataHashState, dataState } from '../atoms';
import getFromLocalStorage from '../utilities/localforage/getFromLocalStorage';

/**
 * Set static data about routes/trips/stops/shapes.
 */
export const setData =
  ({ set }) =>
  (data) => {
    set(dataState, data.data);
    set(dataHashState, data.hash);
  };

export const fetchData =
  ({ set }) =>
  async () => {
    const dataHash = await getFromLocalStorage('dataHashState');
    const data = await getFromLocalStorage('dataState');
    set(dataHashState, dataHash || 'NONE');
    if (data) set(dataState, data);

    const updatedDataState = await getPersistentData(dataHash);
    if (updatedDataState) {
      set(dataState, updatedDataState.data);
      set(dataHashState, updatedDataState.hash);
    }
  };

/**
 * Gets persistent data for the app.
 * @returns data if the data was found, otherwise null if the latest data is already on device
 */
const getPersistentData = async (hash) => {
  try {
    // TODO: abstract urls to environment variable
    const dataResponse = await fetch('https://amesride.demerstech.com/data?hash=' + hash);
    if (dataResponse.status === 204) {
      // hash shows latest data already loaded
      return null;
    }

    if (dataResponse.status === 200) {
      return dataResponse.json();
    }
  } catch (e) {
    console.error('failed to get persistent data');
    console.error(e);

    return new Promise((resolve) => {
      setTimeout(
        () => {
          resolve(getPersistentData());
        },
        hash ? 60 * 1000 : 3 * 1000
      );
    });
  }
};
