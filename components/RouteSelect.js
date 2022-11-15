import localForage from 'localforage';
import fsDriver, { driverKey } from 'localforage-expo-filesystem-driver';
import React from 'react';
import { View, Text, Pressable } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useRecoilValue } from 'recoil';

import {
  currentRouteRowState,
  dispatcherState,
  favoriteRoutesState,
  loadingVehiclesState,
} from '../state/atoms';
import { favoriteRoutesOnlyState, routesSortedState } from '../state/selectors';
import LoadingIndicator from './ArrivalsLoadingIndicator';

const setup = async () => {
  await localForage.defineDriver(fsDriver);
  return localForage.setDriver(driverKey);
};

const RouteSelect = () => {
  const routes = useRecoilValue(routesSortedState);
  const dispatcher = useRecoilValue(dispatcherState);
  const favoriteRoutes = useRecoilValue(favoriteRoutesOnlyState);
  const favoriteIDs = useRecoilValue(favoriteRoutesState);
  const currentRoute = useRecoilValue(currentRouteRowState);
  const isLoadingVehicles = useRecoilValue(loadingVehiclesState);
  const [showDropDown, setShowDropDown] = React.useState(false);
  const [routeList, setRouteList] = React.useState([]);

  React.useEffect(() => {
    (async () => {
      await setup();
      dispatcher?.fetchRoutes();
      dispatcher?.fetchFavoriteStops();
      dispatcher?.fetchStops();
      dispatcher?.fetchFavorites();
      dispatcher?.fetchUserSettings();
    })();
  }, [dispatcher]);

  React.useEffect(() => {
    setRouteList([
      { label: 'Favorite Stops', value: -2, key: 'fav', index: 0 },
      { label: 'All Stops/Routes', value: -1, key: 'all', index: 1 },
      ...favoriteRoutes.map((r, i) => ({
        label: r.DisplayName,
        value: r.ID,
        index: i + 2,
        key: r.ID + 'f',
      })),
      ...routes.map((r, i) => ({
        label: r.DisplayName,
        value: r.ID,
        index: favoriteRoutes.length + i + 2,
        key: r.ID,
      })),
    ]);
  }, [routes, favoriteRoutes]);

  const open = () => setShowDropDown(true);
  const close = () => setShowDropDown(false);

  const favoritesClick = (routeID) => {
    if (!favoriteIDs.has(routeID)) dispatcher.addFavorite(routeID);
    else dispatcher.removeFavorite(routeID);
  };

  const handleSelect = (index) => {
    if (index === 0) dispatcher?.updateCurrentRoute(null);
    else dispatcher?.updateCurrentRoute(index);
  };

  return (
    <View style={{ width: '100%' }}>
      <View style={{ marginTop: 10, marginBottom: 10, width: '90%', marginLeft: '5%' }}>
        <DropDownPicker
          open={showDropDown}
          value={currentRoute}
          items={routeList}
          maxHeight={250}
          setOpen={open}
          onClose={close}
          onSelectItem={(value) => {
            handleSelect(value);
          }}
          itemKey="key"
          renderListItem={(props) => {
            return (
              <Pressable onPress={() => props.onPress(props.item.value)}>
                <View
                  style={{
                    height: 40,
                    paddingHorizontal: 10,
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    justifyContent: 'space-between',
                    alignContent: 'center',
                    alignItems: 'center',
                    flexGrow: 1,
                    flex: 1,
                    borderBottomColor:
                      props.item.index === favoriteRoutes.length + 1 ? 'grey' : 'inherit',
                    borderBottomWidth: props.item.index === favoriteRoutes.length + 1 ? 1 : 0,
                    backgroundColor: props.item.value === currentRoute ? '#DEDEDE' : 'white',
                  }}>
                  <Text
                    style={{
                      fontSize: 16,
                      flex: 1,
                    }}>
                    {props.label}
                  </Text>
                  {props.item.value >= 0 && (
                    <Pressable
                      onPress={() => favoritesClick(props.item.value)}
                      style={{ paddingHorizontal: 12, paddingVertical: 8 }}>
                      <Ionicons
                        name={favoriteIDs.has(props.item.value) ? 'star' : 'star-outline'}
                        size={16}
                        color="black"
                      />
                    </Pressable>
                  )}
                </View>
              </Pressable>
            );
          }}
        />
      </View>
      <LoadingIndicator loading={isLoadingVehicles} />
    </View>
  );
};

export default RouteSelect;
