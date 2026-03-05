import { MaterialCommunityIcons } from '@expo/vector-icons';
import { differenceInMinutes, format, parse } from 'date-fns';
import React from 'react';
import { View } from 'react-native';
import Pressable from 'react-native/Libraries/Components/Pressable/Pressable';
import { Text } from 'react-native-paper';
import { useRecoilValue } from 'recoil';

import QuickNotifyModal from './QuickNotifyModal';
import { getPendingQuickNotify } from '../../../services/notifications';
import {
  currentStopState,
  dataState,
  dispatcherState,
  favoriteRoutesState,
  loadingArrivalsState,
  userSettingsState,
} from '../../../state/atoms';
import { upcomingArrivalsSorted } from '../../../state/selectors';

const UpcomingArrivals = () => {
  const upcomingArrivals = useRecoilValue(upcomingArrivalsSorted);
  const data = useRecoilValue(dataState);
  const currentStop = useRecoilValue(currentStopState);
  const dispatcher = useRecoilValue(dispatcherState);
  const loadingArrivals = useRecoilValue(loadingArrivalsState);
  const settings = useRecoilValue(userSettingsState);
  const favoriteRouteIDs = useRecoilValue(favoriteRoutesState);

  const [quickNotifyArrival, setQuickNotifyArrival] = React.useState(null);
  const [pendingNotifs, setPendingNotifs] = React.useState({});

  const refreshPending = React.useCallback(() => {
    getPendingQuickNotify().then(setPendingNotifs);
  }, []);

  React.useEffect(() => {
    refreshPending();
  }, [refreshPending]);

  if (!data) return null;

  let renderArrivals = [];
  if (upcomingArrivals && !loadingArrivals) {
    renderArrivals = upcomingArrivals.map((arrival) => {
      const r = data.routes[data.trips[arrival.trip_id].route_id];

      if (settings?.showFavoriteArrivalsOnly && !favoriteRouteIDs.has(r.route_id)) return null;

      let { hours, minutes } = arrival.arrival_time;
      let rollover = false;
      if (hours >= 24) {
        hours %= 24;
        rollover = true;
      }

      const d = parse(`${hours}:${minutes}`, 'H:m', Date.now());
      let diffMins = differenceInMinutes(d, Date.now(), { roundingMethod: 'ceil' });

      if (rollover) diffMins += 1440;
      if (diffMins > 180) return null;

      return (
        <Pressable
          key={arrival.trip_id}
          onPress={() => {
            setQuickNotifyArrival({ arrival, route: r });
          }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              borderLeftColor: `#${r.route_color}` || 'inherit',
              borderLeftWidth: 10,
              marginVertical: 4,
            }}>
            <Text style={{ paddingLeft: 4, flex: 1 }}>
              {r.route_long_name} - {format(d, 'h:mm a')} (
              {diffMins > 1 ? diffMins + ' minutes' : diffMins === 1 ? '1 minute' : 'arriving'})
            </Text>
            <MaterialCommunityIcons
              name={pendingNotifs[arrival.trip_id] ? 'bell' : 'bell-outline'}
              size={16}
              color={pendingNotifs[arrival.trip_id] ? '#555' : '#aaa'}
            />
          </View>
        </Pressable>
      );
    });
  }
  return (
    <>
      <Text style={{ fontWeight: 'bold', fontSize: 16 }}>
        Upcoming Arrivals{settings.showFavoriteArrivalsOnly && ' (favorite routes)'}
      </Text>

      {loadingArrivals ? (
        <Text>Loading...</Text>
      ) : upcomingArrivals === null ? null : upcomingArrivals.length === 0 ? (
        <Text>No upcoming arrivals.</Text>
      ) : renderArrivals.filter((arrival) => arrival !== null).length > 0 ? (
        renderArrivals
      ) : (
        <Text>No upcoming arrivals on favorited routes.</Text>
      )}

      <QuickNotifyModal
        visible={Boolean(quickNotifyArrival)}
        onDismiss={() => {
          setQuickNotifyArrival(null);
          refreshPending();
        }}
        arrival={quickNotifyArrival?.arrival}
        route={quickNotifyArrival?.route}
        stop={currentStop}
      />
    </>
  );
};

export default UpcomingArrivals;
