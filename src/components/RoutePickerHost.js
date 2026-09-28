import React from 'react';
import { Modal, Platform, StatusBar } from 'react-native';
import { Portal } from 'react-native-paper';
import { initialWindowMetrics } from 'react-native-safe-area-context';

import SelectRouteScreen from './SelectRouteScreen';
import RoutePickerContext from './routePickerContext';

// A stack screen detaches Home and this Maps SDK clears its surface on the way
// out. A plain view cannot cover that surface either. A modal is its own
// window, so the list stays opaque and the map stays mounted underneath.
export default function RoutePickerHost({ children }) {
  const [open, setOpen] = React.useState(false);
  // The modal draws under the status bar. The safe-area provider is outside
  // this window, so its inset is 0 here and the header starts in the status
  // bar. Pad with the height measured at startup, which is already known.
  const topInset =
    Platform.OS === 'android'
      ? StatusBar.currentHeight ?? initialWindowMetrics?.insets.top ?? 0
      : initialWindowMetrics?.insets.top ?? 0;
  const api = React.useMemo(
    () => ({
      open: () => setOpen(true),
      close: () => setOpen(false),
    }),
    []
  );

  return (
    <RoutePickerContext.Provider value={api}>
      {children}
      <Modal visible={open} animationType="fade" onRequestClose={api.close} statusBarTranslucent>
        {/* Paper Menu portals to the nearest host. The root host is behind this
            window, so the favorites menu never appears unless the host is here. */}
        <Portal.Host>
          <SelectRouteScreen topInset={topInset} />
        </Portal.Host>
      </Modal>
    </RoutePickerContext.Provider>
  );
}
