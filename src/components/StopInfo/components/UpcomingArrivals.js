import React from 'react';
import { Pressable, View } from 'react-native';
import { Text } from 'react-native-paper';
import { useRecoilValue } from 'recoil';

import {
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
  const dispatcher = useRecoilValue(dispatcherState);
  const loadingArrivals = useRecoilValue(loadingArrivalsState);
  const settings = useRecoilValue(userSettingsState);
  const favoriteRouteIDs = useRecoilValue(favoriteRoutesState);

  if (!data) return;

  let renderArrivals = [];
  if (upcomingArrivals && !loadingArrivals) {
    renderArrivals = upcomingArrivals.map((arrival) => {
      const r = data.routes[data.trips[arrival.trip_id].route_id];

      if (settings?.showFavoriteArrivalsOnly && !favoriteRouteIDs.has(r.route_id)) return null;

      const hours = Number(arrival.arrival_time?.hours);
      const minutes = Number(arrival.arrival_time?.minutes);
      if (!Number.isFinite(hours) || !Number.isFinite(minutes)) return null;

      // Compare minutes since midnight. Building a Date here was wrong on
      // Hermes: the clock looked right, but the timestamp was already past,
      // so every row fell through to "arriving".
      const now = new Date();
      const nowMinutes = now.getHours() * 60 + now.getMinutes();
      let diffMins = hours * 60 + minutes - nowMinutes;
      if (diffMins < -12 * 60) diffMins += 24 * 60;
      if (diffMins > 180) return null;

      const clockHours = ((hours % 24) + 24) % 24;
      const clockLabel = `${clockHours % 12 || 12}:${String(minutes).padStart(2, '0')} ${
        clockHours < 12 ? 'AM' : 'PM'
      }`;

      return (
        <Pressable
          key={arrival.trip_id}
          onPress={() => {
            dispatcher?.updateCurrentRoute(r.route_id, false);
          }}>
          <View
            style={{
              borderLeftColor: `#${r.route_color}` || 'inherit',
              borderLeftWidth: 10,
              marginVertical: 4,
            }}>
            <Text style={{ paddingLeft: 4 }}>
              {r.route_long_name} - {clockLabel} (
              {diffMins > 1 ? `${diffMins} minutes` : diffMins === 1 ? '1 minute' : 'arriving'})
            </Text>
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
    </>
  );
};

export default UpcomingArrivals;
