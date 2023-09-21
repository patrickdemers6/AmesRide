import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import { RootSiblingParent } from 'react-native-root-siblings';
import { RecoilRoot } from 'recoil';

import Main from './src/Main';
import theme from './src/styles/theme';

const App = () => {
  return (
    <RootSiblingParent>
      <NavigationContainer>
        <RecoilRoot>
          <PaperProvider theme={theme}>
            <Main />
          </PaperProvider>
        </RecoilRoot>
      </NavigationContainer>
    </RootSiblingParent>
  );
};
export default App;
