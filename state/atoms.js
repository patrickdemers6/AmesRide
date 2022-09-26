import * as localForage from 'localforage';
import { atom } from 'recoil';

export const routesState = atom({
  key: 'routesState',
  default: [],
});

export const vehicleLocationState = atom({
  key: 'vehicleLocationState',
  default: null,
});

export const currentRouteRowState = atom({
  key: 'currentRouteRowState',
  default: null,
});

export const dispatcherState = atom({
  key: 'dispatcherState',
  default: undefined,
});

export const currentStopState = atom({
  key: 'currentStopState',
  default: null,
});

export const upcomingArrivalsState = atom({
  key: 'upcomingArrivalsState',
  default: null,
});

export const userLocationState = atom({
  key: 'userLocationState',
  default: null,
});

const localForageEffect =
  (key) =>
  ({ onSet }) => {
    // Subscribe to state changes and persist them to localForage
    onSet((newValue, _, isReset) =>
      isReset ? localForage.removeItem(key) : localForage.setItem(key, JSON.stringify(newValue))
    );
  };

export const favoriteRoutesState = atom({
  key: 'favoriteRoutesState',
  default: [],
  effects: [localForageEffect('favorites')],
});
