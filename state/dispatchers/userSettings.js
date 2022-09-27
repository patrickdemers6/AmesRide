import localForage from 'localforage';

import { userSettingsState } from '../atoms';

export const fetchUserSettings =
  ({ set }) =>
  () => {
    localForage.getItem('userSettingsState').then((savedValue) => {
      set(userSettingsState, savedValue != null ? JSON.parse(savedValue) : {});
    });
  };

export const setUserSetting =
  ({ set }) =>
  (key, value) => {
    set(userSettingsState, (settings) => ({ ...settings, [key]: value }));
  };

export const toggleUserSetting =
  ({ set }) =>
  (key) => {
    set(userSettingsState, (settings) => ({ ...settings, [key]: !settings[key] }));
  };
