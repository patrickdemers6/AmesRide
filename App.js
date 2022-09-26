import * as Location from 'expo-location';
import React from 'react';
import { RecoilRoot } from 'recoil';

import Main from './Main';

const App = () => {
  React.useEffect(() => {
    (async () => {
      await Location.requestForegroundPermissionsAsync();
    })();
  }, []);

  return (
    <RecoilRoot>
      <Main />
    </RecoilRoot>
  );
};
export default App;
