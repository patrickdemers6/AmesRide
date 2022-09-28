import localForage from 'localforage';

const localForageEffect =
  (key) =>
  ({ onSet }) => {
    // Subscribe to state changes and persist them to localForage
    onSet((newValue, _, isReset) =>
      isReset ? localForage.removeItem(key) : localForage.setItem(key, JSON.stringify(newValue))
    );
  };

export default localForageEffect;
