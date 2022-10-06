import { Select, SelectItem } from '@ui-kitten/components';
import localForage from 'localforage';
import fsDriver, { driverKey } from 'localforage-expo-filesystem-driver';
import React from 'react';
import { View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useRecoilValue } from 'recoil';

import {
  currentRouteRowState,
  dispatcherState,
  favoriteRoutesState,
  routesState,
} from '../state/atoms';
import { currentRoute, favoriteRoutesOnlyState } from '../state/selectors';

const setup = async () => {
  await localForage.defineDriver(fsDriver);
  return localForage.setDriver(driverKey);
};

const RouteSelect = () => {
  const routes = useRecoilValue(routesState);
  const routeRow = useRecoilValue(currentRouteRowState);
  const selectedRoute = useRecoilValue(currentRoute);
  const dispatcher = useRecoilValue(dispatcherState);
  const favoriteRoutes = useRecoilValue(favoriteRoutesOnlyState);
  const favoriteIDs = useRecoilValue(favoriteRoutesState);

  React.useEffect(() => {
    (async () => {
      await setup();
      dispatcher?.fetchRoutes();
      dispatcher?.fetchFavorites();
      dispatcher?.fetchFavoriteStops();
      dispatcher?.fetchUserSettings();
    })();
  }, [dispatcher]);

  const favoritesClick = (id) => {
    if (favoriteIDs.includes(id)) dispatcher?.removeFavorite(id);
    else dispatcher?.addFavorite(id);
  };

  const handleSelect = (e) => {
    if (favoriteIDs.length > 0) {
      // if row is not in favorites
      if (e.row >= favoriteIDs.length)
        // extra +1 accounts for the <View> that separates favorites and all routes
        e.row -= favoriteIDs.length + 1;
      else {
        // if in favorites, determine the row it is also present in
        e.row = routes.map((r) => r.ID).indexOf(favoriteIDs[e.row]);
      }
    }

    dispatcher?.updateCurrentRoute(e);
  };

  const index = routeRow ? routeRow.row : null;

  return (
    <Select
      style={{ width: '90%', marginBottom: 12 }}
      value={selectedRoute.DisplayName || 'Select a route'}
      onSelect={handleSelect}>
      {favoriteIDs &&
        favoriteRoutes.map((r, i) => (
          <SelectItem
            selected={routes && routes[index]?.ID === r.ID}
            key={i}
            accessoryRight={<Star filled onPress={() => favoritesClick(r.ID)} />}
            title={r.DisplayName}
          />
        ))}
      {favoriteIDs && favoriteRoutes?.length > 0 ? (
        <View style={{ height: 1, backgroundColor: 'grey', width: '100%' }} />
      ) : null}
      {favoriteIDs &&
        routes.map((r, i) => (
          <SelectItem
            key={i + favoriteIDs.length}
            selected={i === index}
            accessoryRight={
              <Star filled={favoriteIDs.includes(r.ID)} onPress={() => favoritesClick(r.ID)} />
            }
            title={r.DisplayName}
          />
        ))}
    </Select>
  );
};

const Star = (props) => {
  return (
    <Ionicons.Button
      {...props}
      backgroundColor="transparent"
      underlayColor="transparent"
      style={{ alignItems: 'center', justifyContent: 'center', height: 20 }}
      iconStyle={{
        color: 'black',
        width: 17,
        height: 17,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 'auto',
        marginRight: 'auto',
      }}
      name={props.filled ? 'star' : 'star-outline'}
      size={17}
      onPress={props.onPress}
    />
  );
};

export default RouteSelect;
