import { atom } from 'recoil';

import { localForageEffectSet, localForageEffect } from './utilities/localforage/updateEffects';

export const routesState = atom({
  key: 'routesState',
  default: [],
  effects: [localForageEffect('routes')],
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

export const favoriteRoutesState = atom({
  key: 'favoriteRoutesState',
  default: [],
  effects: [localForageEffect('favorites')],
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
