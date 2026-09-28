import React from 'react';

const RoutePickerContext = React.createContext({
  open() {},
  close() {},
});

export function useRoutePicker() {
  return React.useContext(RoutePickerContext);
}

export default RoutePickerContext;
