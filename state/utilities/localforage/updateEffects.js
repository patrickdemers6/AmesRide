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
      console.log('saving', JSON.stringify(Array.from(newValue)));
      isReset
        ? localForage.removeItem(key)
        : localForage.setItem(key, JSON.stringify(Array.from(newValue)));
    });
  };
