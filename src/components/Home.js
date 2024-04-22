import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Portal } from 'react-native-paper';

import Map from './Map/Map';
import RouteSelect from './RouteSelect';
import StopInfo from './StopInfo/StopInfo';
import Websocket from './Websocket';

const styles = StyleSheet.create({
  page: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    width: '100%',
    height: '100%',
  },
  container: {
    height: '100%',
    width: '100%',
  },
});
const Home = () => {
  return (
    <>
      <Portal.Host>
        <Websocket>
          <View style={styles.page}>
            <RouteSelect />
            <Map />
            <StopInfo />
          </View>
        </Websocket>
      </Portal.Host>
    </>
  );
};

export default React.memo(Home);
