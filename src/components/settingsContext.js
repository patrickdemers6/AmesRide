import React from 'react';

const SettingsContext = React.createContext({
  open() {},
  close() {},
});

export function useSettings() {
  return React.useContext(SettingsContext);
}

export default SettingsContext;
