import React from 'react';

// Recoil 0.7.7 checks React.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED
// to see whether the renderer implements useSyncExternalStore. React 19 removed
// that export. React 19 always has useSyncExternalStore, so report that.
if (!React.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED) {
  // i deserve to be fired
  React.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = {
    ReactCurrentDispatcher: {
      current: {
        useSyncExternalStore: React.useSyncExternalStore,
      },
    },
  };
}
