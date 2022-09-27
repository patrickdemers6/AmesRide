import { Text } from '@ui-kitten/components';
import React from 'react';
import { ScrollView, View } from 'react-native';
import GestureRecognizer from 'react-native-swipe-gestures';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Pressable from 'react-native/Libraries/Components/Pressable/Pressable';
import { useRecoilValue } from 'recoil';

import {
  currentStopState,
  dispatcherState,
  favoriteRoutesState,
  routesState,
  userSettingsState,
} from '../../../state/atoms';
import { upcomingArrivalsSorted } from '../../../state/selectors';

const StopDetailsView = () => {
  const stop = useRecoilValue(currentStopState);
  const upcomingArrivals = useRecoilValue(upcomingArrivalsSorted);
  const routes = useRecoilValue(routesState);
  const dispatcher = useRecoilValue(dispatcherState);
  const settings = useRecoilValue(userSettingsState);
  const favoriteRouteIDs = useRecoilValue(favoriteRoutesState);

  // used so text doesn't disappear when sliding out
  const [cached, setCached] = React.useState({ stopName: '', arrivals: [] });

  const storeStopNameInCache = () => {
    setCached((c) => ({ ...c, stopName: stop.Name }));
  };

  const toggleFilterSetting = () => {
    dispatcher?.toggleUserSetting('showFavoriteArrivalsOnly');
  };

  const handleUpdatedStop = () => {
    if (!stop) return;

    storeStopNameInCache();

    const interval = fetchUpcomingArrivalsOnInterval(stop, dispatcher);
    return () => clearInterval(interval);
  };

  const storeArrivalsInCache = () => {
    if (!upcomingArrivals) return;

    setCached((c) => ({ ...c, arrivals: upcomingArrivals }));
  };

  React.useEffect(handleUpdatedStop, [stop]);
  React.useEffect(storeArrivalsInCache, [upcomingArrivals]);

  return (
    <GestureRecognizer onSwipeDown={dispatcher?.clearCurrentStop} style={{ width: '100%' }}>
      <View style={{ width: '100%', height: '100%' }}>
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
              paddingLeft: 12,
              paddingRight: 12,
            }}>
            <Text style={{ width: '100%', float: 'left' }}>{stop?.Name || cached.stopName}</Text>
            <Icon
              onPress={toggleFilterSetting}
              size={18}
              name={settings.showFavoriteArrivalsOnly ? 'filter' : 'filter-outline'}
            />
          </View>
        </View>
        <View style={{ flex: 1, height: '100%' }}>
          <ScrollView
            style={{ padding: 8, height: '100%', width: '100%' }}
            onScroll={(e) => e.stopPropagation()}>
            <Text style={{ fontWeight: 'bold', fontSize: 16 }}>Upcoming Arrivals</Text>
            {upcomingArrivals === null ? null : upcomingArrivals.length === 0 ? (
              <Text>No upcoming arrivals.</Text>
            ) : (
              upcomingArrivals.map((arrival) => {
                const r = routes.filter((route) =>
                  route.Patterns.map((p) => p.ID).includes(arrival.RouteID)
                )[0];

                if (settings?.showFavoriteArrivalsOnly && !favoriteRouteIDs.includes(r.ID))
                  return null;

                return (
                  <Pressable
                    key={arrival.TripId}
                    onPress={() => {
                      const route = {
                        equals: selectEqualsFunction,
                        row: routes.indexOf(
                          routes.filter((r) =>
                            r.Patterns.map((p) => p.Name).includes(arrival.RouteName)
                          )[0]
                        ),
                      };
                      dispatcher?.updateCurrentRoute(route, false);
                    }}>
                    <View
                      style={{ borderLeftColor: r.Color, borderLeftWidth: 10, marginVertical: 4 }}>
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
            <View style={{ height: 70 }} />
          </ScrollView>
        </View>
      </View>
    </GestureRecognizer>
  );
};

const selectEqualsFunction =
  'function(other){if(!other){return false;} return _this.row===other.row && _this.section===other.section;}';

const fetchUpcomingArrivalsOnInterval = (stop, dispatcher) => {
  const fetchUpcomingArrivals = () => dispatcher?.fetchUpcomingArrivals(stop);
  fetchUpcomingArrivals();
  return setInterval(fetchUpcomingArrivals, 15 * 1000);
};

export default StopDetailsView;
