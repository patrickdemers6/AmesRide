import * as eva from '@eva-design/eva';
import { ApplicationProvider } from '@ui-kitten/components';
import React from 'react';
import { StatusBar, StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useSetRecoilState } from 'recoil';

import Map from './components/Map/Map';
import RouteSelect from './components/RouteSelect';
import StopInfo from './components/StopInfo/StopInfo';
import { dispatcherState } from './state/atoms';
import { createDispatcher } from './state/dispatcher';

const styles = StyleSheet.create({
  page: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    width: '100%',
    height: '100%',
    paddingTop: 36,
  },
  container: {
    height: '100%',
    width: '100%',
  },
  map: {
    flex: 1,
  },
  button: {
    padding: 8,
  },
  buttonText: {
    fontSize: 17,
    color: '#007AFF',
  },
  subView: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 12,
    height: 200,
  },
});

export default function Main() {
  const setDispatcher = useSetRecoilState(dispatcherState);

  const dispatcherRef = React.useRef(createDispatcher());

  React.useEffect(() => {
    setDispatcher(dispatcherRef.current);
  }, []);

  return (
    <SafeAreaProvider>
      <StatusBar backgroundColor="white" barStyle="dark-content" />
      <ApplicationProvider {...eva} theme={eva.light}>
        <View style={styles.page}>
          <RouteSelect />
          <View style={styles.container}>
            <Map />
            <StopInfo />
          </View>
        </View>
      </ApplicationProvider>
    </SafeAreaProvider>
  );
}
