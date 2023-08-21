import { atom } from 'recoil';

import { FAVORITE_ROUTES } from './constants';
import { localForageEffectSet, localForageEffect } from './utilities/localforage/updateEffects';

export const vehicleLocationState = atom({
  key: 'vehicleLocationState',
  default: null,
});

export const vehicleLocationWaitingState = atom({
  key: 'vehicleLocationWaitingState',
  default: false,
});

export const currentRouteRowState = atom({
  key: 'currentRouteRowState',
  default: FAVORITE_ROUTES,
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

export const favoriteRoutesState = atom({
  key: 'favoriteRoutesState',
  default: new Set(),
  effects: [localForageEffectSet('favorite-routes')],
});

export const favoriteStopsState = atom({
  key: 'favoriteStopsState',
  default: new Set(),
  effects: [localForageEffectSet('favorite-stops')],
});

export const userSettingsState = atom({
  key: 'userSettingsState',
  default: {
    showFavoriteArrivalsOnly: false,
  },
  effects: [localForageEffect('userSettingsState')],
});

export const loadingArrivalsState = atom({
  key: 'loadingArrivalsState',
  default: false,
});

export const loadingVehiclesState = atom({
  key: 'loadingVehiclesState',
  default: false,
});

export const websocketState = atom({
  key: 'websocketState',
  default: null,
});

export const dataState = atom({
  key: 'dataState',
  default: { routes: null, stops: null, trips: null, shapes: null },
  effects: [localForageEffect('dataState')],
});
export const dataHashState = atom({
  key: 'dataHashState',
  default: '',
  effects: [localForageEffect('dataHashState')],
});
