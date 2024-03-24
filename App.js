import { driverWithoutSerialization } from '@aveq-research/localforage-asyncstorage-driver';
import { NavigationContainer } from '@react-navigation/native';
import * as SplashScreen from 'expo-splash-screen';
import localforage from 'localforage';
import React, { useState } from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import { RootSiblingParent } from 'react-native-root-siblings';
import { RecoilRoot, useRecoilValue, useSetRecoilState } from 'recoil';

import Main from './src/Main';
import { dispatcherState } from './src/state/atoms';
import { createDispatcher } from './src/state/dispatcher';
import { themeSelector, userSettingsInitialized } from './src/state/selectors';

const InjectTheme = ({ children }) => {
  const theme = useRecoilValue(themeSelector);
  return (
    <NavigationContainer theme={theme}>
      <PaperProvider theme={theme}>{children}</PaperProvider>
    </NavigationContainer>
  );
};

SplashScreen.preventAutoHideAsync();

const setup = async () => {
  const driver = driverWithoutSerialization();
  await localforage.defineDriver(driver);
  await localforage.setDriver(driver._driver);
};

const LoadData = (props) => {
  const dispatcherRef = React.useRef(createDispatcher());
  const setDispatcher = useSetRecoilState(dispatcherState);
  const ready = useRecoilValue(userSettingsInitialized);
  React.useEffect(() => {
    setDispatcher(dispatcherRef.current);
  }, []);

  const dispatcher = useRecoilValue(dispatcherState);
  const [updatedOnce, setUpdatedOnce] = React.useState(false);

  React.useEffect(() => {
    (async () => {
      if (!dispatcher || updatedOnce) return;
      setUpdatedOnce(true);
      await setup();
      dispatcher?.fetchData();
      dispatcher?.fetchFavoriteStops();
      dispatcher?.fetchFavorites();
      dispatcher?.fetchUserSettings();
    })();
  }, [dispatcher]);

  React.useEffect(() => {
    if (ready) {
      props.ready();
    }
  }, [ready]);

  return props.children;
};

const App = () => {
  const [appIsReady, setAppIsReady] = useState(false);

  React.useEffect(() => {
    if (appIsReady) {
      // slight delay to allow user settings to render
      setTimeout(() => {
        SplashScreen.hideAsync();
      }, 250);
    }
  }, [appIsReady]);

  return (
    <RootSiblingParent>
      <RecoilRoot>
        <InjectTheme>
          <LoadData ready={() => setAppIsReady(true)}>
            <Main />
          </LoadData>
        </InjectTheme>
      </RecoilRoot>
    </RootSiblingParent>
  );
};
export default App;
