import Constants from 'expo-constants';
import { Platform } from 'react-native';

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
    let url = `${process.env.EXPO_PUBLIC_BACKEND_HOST}/data?hash=${hash}&os=${Platform.OS}`;
    if (Constants.expoConfig?.version) {
      url += `&version=${Constants.expoConfig.version}`;
    }

    const dataResponse = await fetch(url);
    if (dataResponse.status === 204) {
      // hash shows latest data already loaded
      return null;
    }

    if (dataResponse.status === 200) {
      return dataResponse.json();
    }

    throw new Error('something went wrong');
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
