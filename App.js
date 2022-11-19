import { NavigationContainer } from '@react-navigation/native';
import * as Location from 'expo-location';
import React from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import { RecoilRoot } from 'recoil';

import Main from './src/Main';

const App = () => {
  React.useEffect(() => {
    (async () => {
      await Location.requestForegroundPermissionsAsync();
    })();
  }, []);

  return (
    <NavigationContainer>
      <RecoilRoot>
        <PaperProvider>
          <Main />
        </PaperProvider>
      </RecoilRoot>
    </NavigationContainer>
  );
};
export default App;
