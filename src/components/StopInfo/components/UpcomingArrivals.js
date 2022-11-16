import { Text } from '@ui-kitten/components';
import React from 'react';
import { View } from 'react-native';
import Pressable from 'react-native/Libraries/Components/Pressable/Pressable';
import { useRecoilValue } from 'recoil';

import {
  dispatcherState,
  favoriteRoutesState,
  routePatternsState,
  routesState,
  userSettingsState,
} from '../../../state/atoms';
import { upcomingArrivalsSorted } from '../../../state/selectors';

const UpcomingArrivals = () => {
  const upcomingArrivals = useRecoilValue(upcomingArrivalsSorted);
  const routes = useRecoilValue(routesState);
  const routePatterns = useRecoilValue(routePatternsState);
  const dispatcher = useRecoilValue(dispatcherState);
  const settings = useRecoilValue(userSettingsState);
  const favoriteRouteIDs = useRecoilValue(favoriteRoutesState);

  let renderArrivals = [];
  if (upcomingArrivals) {
    renderArrivals = upcomingArrivals.map((arrival) => {
      const r = routes[routePatterns[arrival.RouteID]];

      if (settings?.showFavoriteArrivalsOnly && !favoriteRouteIDs.has(r.ID)) return null;

      const diffMins = getMinsToTime(arrival.ArriveTime);

      if (diffMins > 180) return null;

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
              {diffMins > 1 ? diffMins + ' minutes' : diffMins === 1 ? '1 minute' : 'arriving'})
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

      {upcomingArrivals === null ? null : upcomingArrivals.length === 0 ? (
        <Text>No upcoming arrivals.</Text>
      ) : renderArrivals.filter((arrival) => arrival !== null).length > 0 ? (
        renderArrivals
      ) : (
        <Text>No upcoming arrivals on favorited routes.</Text>
      )}
    </>
  );
};

/**
 * Get the minutes until a given time. Assumes the time is not in the past.
 * @param {*} arriveTime arrival time in format HH:MM [AM|PM]
 * @returns minutes until the given time
 */
const getMinsToTime = (arriveTime) => {
  const arrivalDate = new Date(new Date().getTime());
  const minutes = Number.parseInt(
    arriveTime.substring(arriveTime.indexOf(':') + 1, arriveTime.indexOf(':') + 3),
    10
  );
  arrivalDate.setMinutes(minutes);
  let hours = Number.parseInt(arriveTime.substring(0, arriveTime.indexOf(':')), 10);

  // if hour === 12 and it is am, set hour to zero since it is 12am hour
  if (hours === 12 && arriveTime.endsWith('AM')) hours = 0;

  arrivalDate.setHours(hours);

  // if it is currently pm and the arrival time is in the am
  if (new Date().getHours() >= 12 && arriveTime.endsWith('AM')) {
    // add 24 hours to make it be the next day
    arrivalDate.setTime(arrivalDate.getTime() + 24 * 60 * 60 * 1000);
  }
  // if the given time is in the PM but not in the hour of 12, increase by 12 hours to make date pm
  else if (hours < 12 && arriveTime.endsWith('PM')) {
    arrivalDate.setTime(arrivalDate.getTime() + 12 * 60 * 60 * 1000);
  }

  // get minutes between calculated arrival date and current date
  return Math.round((arrivalDate - new Date()) / 1000 / 60);
};

export default UpcomingArrivals;
