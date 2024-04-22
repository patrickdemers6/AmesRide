import { userSettingsState } from '../atoms';
import getFromLocalStorage from '../utilities/localforage/getFromLocalStorage';

export const fetchUserSettings =
  ({ set }) =>
  async () => {
    const settings = await getFromLocalStorage('userSettingsState');
    set(userSettingsState, (s) =>
      settings ? { ...s, ...settings, initialized: true } : { ...s, initialized: true }
    );
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
