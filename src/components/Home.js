import React from 'react';
import { StyleSheet, View } from 'react-native';

import Map from './Map/Map';
import RouteSelect from './RouteSelect';
import SettingsFAB from './Settings/FAB';
import StopInfo from './StopInfo/StopInfo';

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
});

const Home = () => {
  return (
    <>
      <View style={styles.page}>
        <RouteSelect />
        <View style={styles.container}>
          <Map />
          <StopInfo />
        </View>
      </View>
      <SettingsFAB />
    </>
  );
};

export default Home;
