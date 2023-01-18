import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import { Provider as PaperProvider, DefaultTheme } from 'react-native-paper';
import { RootSiblingParent } from 'react-native-root-siblings';
import { RecoilRoot } from 'recoil';

import Main from './src/Main';

const App = () => {
  return (
    <RootSiblingParent>
      <NavigationContainer>
        <RecoilRoot>
          <PaperProvider theme={DefaultTheme}>
            <Main />
          </PaperProvider>
        </RecoilRoot>
      </NavigationContainer>
    </RootSiblingParent>
  );
};
export default App;
