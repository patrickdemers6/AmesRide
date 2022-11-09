import localForage from 'localforage';

export const localForageEffect =
  (key) =>
  ({ onSet }) => {
    // Subscribe to state changes and persist them to localForage
    onSet((newValue, _, isReset) =>
      isReset ? localForage.removeItem(key) : localForage.setItem(key, JSON.stringify(newValue))
    );
  };
export const localForageEffectSet =
  (key) =>
  ({ onSet }) => {
    // Subscribe to state changes and persist them to localForage

    onSet((newValue, _, isReset) => {
      if (isReset) localForage.removeItem(key);
      else localForage.setItem(key, JSON.stringify(Array.from(newValue)));
    });
  };
