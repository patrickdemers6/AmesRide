import React from 'react';
import { View, Text, Pressable, Platform } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { Portal } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useRecoilValue } from 'recoil';

import {
  currentRouteRowState,
  dataState,
  dispatcherState,
  favoriteRoutesState,
  loadingVehiclesState,
} from '../state/atoms';
import { ALL_ROUTES, FAVORITE_ROUTES } from '../state/constants';
import { favoriteRoutesOnlyState, routesSortedState } from '../state/selectors';
import LoadingIndicator from './LoadingIndicator';

DropDownPicker.modifyTranslation('EN', {
  PLACEHOLDER: 'Loading...',
});

const RouteSelect = () => {
  const data = useRecoilValue(dataState);
  const routes = useRecoilValue(routesSortedState);
  const dispatcher = useRecoilValue(dispatcherState);
  const favoriteRoutes = useRecoilValue(favoriteRoutesOnlyState);
  const favoriteIDs = useRecoilValue(favoriteRoutesState);
  const currentRoute = useRecoilValue(currentRouteRowState);
  const isLoadingVehicles = useRecoilValue(loadingVehiclesState);
  const [showDropDown, setShowDropDown] = React.useState(false);
  const [routeList, setRouteList] = React.useState([]);
  const insets = useSafeAreaInsets();

  React.useEffect(() => {
    if (data?.routes) {
      setRouteList([
        { label: 'Favorite Stops', value: FAVORITE_ROUTES, key: 'fav', index: 0 },
        { label: 'All Stops/Routes', value: ALL_ROUTES, key: 'all', index: 1 },
        ...favoriteRoutes.map((r, i) => ({
          label: r.route_long_name,
          value: r.route_id,
          index: i + 2,
          key: r.route_id + 'f',
        })),
        ...Object.values(routes).map((r, i) => ({
          label: r.route_long_name,
          value: r.route_id,
          index: favoriteRoutes.length + i + 2,
          key: r.route_id,
        })),
      ]);
    }
  }, [routes, favoriteRoutes]);

  const open = () => setShowDropDown(true);
  const close = () => setShowDropDown(false);

  const favoritesClick = (routeID) => {
    if (!favoriteIDs.has(routeID)) dispatcher.addFavorite(routeID);
    else dispatcher.removeFavorite(routeID);
  };

  const handleSelect = (index) => {
    setShowDropDown(false);
    if (index === currentRoute) {
      return;
    }
    if (index === 0) dispatcher?.updateCurrentRoute(null);
    else dispatcher?.updateCurrentRoute(index);
  };

  return (
    <>
      <Portal>
        <View
          style={{
            backgroundColor: 'white',
            height: 50 + (Platform.OS === 'ios' ? insets.top : 0),
          }}>
          <Portal
            style={{
              backgroundColor: 'white',
            }}>
            {Platform.OS === 'ios' ? (
              <View
                style={{
                  transform: [{ translateY: Platform.OS === 'ios' ? insets.top : 0 }],
                  backgroundColor: 'white',
                }}>
                <DropDownPicker
                  open={showDropDown}
                  value={currentRoute}
                  items={routeList}
                  maxHeight={250}
                  setOpen={open}
                  containerStyle={{ maxWidth: '90%', marginLeft: '5%' }}
                  dropDownContainerStyle={{
                    borderRadius: 0,
                  }}
                  onClose={close}
                  itemKey="key"
                  renderListItem={(props) => {
                    return (
                      <Pressable
                        onPress={() => {
                          handleSelect(props.item.value);
                        }}>
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
                            borderBottomWidth:
                              props.item.index === favoriteRoutes.length + 1 ? 1 : 0,
                            backgroundColor:
                              props.item.value === currentRoute ? '#DEDEDE' : 'white',
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
                <LoadingIndicator loading={isLoadingVehicles} />
              </View>
            ) : (
              <>
                <DropDownPicker
                  open={showDropDown}
                  value={currentRoute}
                  items={routeList}
                  maxHeight={250}
                  setOpen={open}
                  containerStyle={{ maxWidth: '90%', marginLeft: '5%' }}
                  onClose={close}
                  itemKey="key"
                  renderListItem={(props) => {
                    return (
                      <Pressable
                        onPress={() => {
                          handleSelect(props.item.value);
                        }}>
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
                            borderBottomWidth:
                              props.item.index === favoriteRoutes.length + 1 ? 1 : 0,
                            backgroundColor:
                              props.item.value === currentRoute ? '#DEDEDE' : 'white',
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
                <LoadingIndicator loading={isLoadingVehicles} />
              </>
            )}
          </Portal>
        </View>
      </Portal>
    </>
  );
};

export default React.memo(RouteSelect);
