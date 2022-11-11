import { Text } from '@ui-kitten/components';
import React from 'react';
import { AppState, ScrollView, View } from 'react-native';
import { Button, Menu } from 'react-native-paper';
import GestureRecognizer from 'react-native-swipe-gestures';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Pressable from 'react-native/Libraries/Components/Pressable/Pressable';
import { useRecoilValue } from 'recoil';

import {
  currentStopState,
  dispatcherState,
  favoriteRoutesState,
  routePatternsState,
  routesState,
  userSettingsState,
} from '../../../state/atoms';
import { isCurrentStopFavorite, upcomingArrivalsSorted } from '../../../state/selectors';

const StopDetailsView = () => {
  const stop = useRecoilValue(currentStopState);
  const upcomingArrivals = useRecoilValue(upcomingArrivalsSorted);
  const routes = useRecoilValue(routesState);
  const routePatterns = useRecoilValue(routePatternsState);
  const dispatcher = useRecoilValue(dispatcherState);
  const settings = useRecoilValue(userSettingsState);
  const favoriteRouteIDs = useRecoilValue(favoriteRoutesState);
  const currentStopFavorite = useRecoilValue(isCurrentStopFavorite);
  const [menuOpen, setMenuOpen] = React.useState(false);

  // used so text doesn't disappear when sliding out
  const [cached, setCached] = React.useState({ stopName: '', arrivals: [] });

  const storeStopNameInCache = () => {
    setCached((c) => ({ ...c, stopName: stop.Name }));
  };

  const toggleFilterSetting = () => {
    dispatcher?.toggleUserSetting('showFavoriteArrivalsOnly');
  };

  const openMenu = () => {
    setMenuOpen(true);
  };
  const closeMenu = () => {
    setMenuOpen(false);
  };

  const handleUpdatedStop = () => {
    if (!stop) return;

    storeStopNameInCache();
    // fetch bus and upcoming arrivals when app comes back into foreground
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (nextAppState === 'active') {
        dispatcher?.fetchUpcomingArrivals(stop);
      }
    });

    const interval = fetchUpcomingArrivalsOnInterval(stop, dispatcher);
    return () => {
      clearInterval(interval);
      subscription.remove();
    };
  };

  const storeArrivalsInCache = () => {
    if (!upcomingArrivals) return;

    setCached((c) => ({ ...c, arrivals: upcomingArrivals }));
  };

  const favoriteStop = () => {
    dispatcher?.toggleFavoriteStop(stop.RtpiNumber);
  };

  React.useEffect(handleUpdatedStop, [stop]);
  React.useEffect(storeArrivalsInCache, [upcomingArrivals]);

  return (
    <View style={{ width: '100%', height: '100%' }}>
      <GestureRecognizer onSwipeDown={dispatcher?.clearCurrentStop} style={{ width: '100%' }}>
        <View
          style={{
            backgroundColor: '#F1BE48',
            width: '100%',
            padding: 12,
            borderTopLeftRadius: 8,
            borderTopRightRadius: 8,
          }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              paddingLeft: 24,
              paddingRight: 12,
            }}>
            <Text style={{ width: '100%', float: 'left' }}>{stop?.Name || cached.stopName}</Text>
            <Menu
              visible={menuOpen}
              style={{ width: 250 }}
              anchor={
                <Button compact onPress={openMenu} color="black" style={{ margin: 0, padding: 0 }}>
                  <Icon name="dots-vertical" onPress={openMenu} size={20} style={{ margin: 0 }} />
                </Button>
              }
              onDismiss={closeMenu}>
              <Menu.Item
                title={
                  settings.showFavoriteArrivalsOnly
                    ? 'Show all routes'
                    : 'Show favorite routes only'
                }
                onPress={toggleFilterSetting}
              />
              <Menu.Item
                title={currentStopFavorite ? 'Unfavorite Stop' : 'Favorite stop'}
                onPress={favoriteStop}
              />
            </Menu>
          </View>
        </View>
      </GestureRecognizer>
      <View style={{ flex: 1, height: '100%', paddingBottom: 8 }}>
        <ScrollView style={{ padding: 8, height: '100%', width: '100%' }}>
          <Text style={{ fontWeight: 'bold', fontSize: 16 }}>
            Upcoming Arrivals{settings.showFavoriteArrivalsOnly && ' (favorite routes)'}
          </Text>
          {upcomingArrivals === null ? null : upcomingArrivals.length === 0 ? (
            <Text>No upcoming arrivals.</Text>
          ) : (
            upcomingArrivals.map((arrival) => {
              const r = routes[routePatterns[arrival.RouteID]];

              if (settings?.showFavoriteArrivalsOnly && !favoriteRouteIDs.has(r.ID)) return null;

              return (
                <Pressable
                  key={arrival.TripId + arrival.BusName + arrival.RouteID}
                  onPress={() => {
                    dispatcher?.updateCurrentRoute(r.ID, false);
                  }}>
                  <View
                    style={{
                      borderLeftColor: r?.Color || 'inherit',
                      borderLeftWidth: 10,
                      marginVertical: 4,
                    }}>
                    <Text style={{ paddingLeft: 4 }}>
                      {r.DisplayName} - {arrival.ArriveTime} (
                      {arrival.Minutes > 1
                        ? arrival.Time + ' minutes'
                        : arrival.Minutes === 1
                        ? '1 minute'
                        : 'arriving'}
                      )
                    </Text>
                  </View>
                </Pressable>
              );
            })
          )}
        </ScrollView>
      </View>
    </View>
  );
};

const fetchUpcomingArrivalsOnInterval = (stop, dispatcher) => {
  const fetchUpcomingArrivals = () => dispatcher?.fetchUpcomingArrivals(stop);
  fetchUpcomingArrivals();
  return setInterval(fetchUpcomingArrivals, 15 * 1000);
};

export default StopDetailsView;
