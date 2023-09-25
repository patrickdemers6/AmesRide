import { driverWithoutSerialization } from '@aveq-research/localforage-asyncstorage-driver';
import localforage from 'localforage';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Portal } from 'react-native-paper';
import { useRecoilValue } from 'recoil';

import { dispatcherState } from '../state/atoms';
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

const setup = async () => {
  const driver = driverWithoutSerialization();
  await localforage.defineDriver(driver);
  await localforage.setDriver(driver._driver);
};

const Home = () => {
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
