import React from 'react';
import { AppState, ScrollView, View } from 'react-native';
import { useRecoilValue } from 'recoil';

import { currentStopState, dispatcherState, loadingArrivalsState } from '../../../state/atoms';
import LoadingIndicator from '../../LoadingIndicator';
import TopBanner from './TopBanner';
import UpcomingArrivals from './UpcomingArrivals';

const StopDetailsView = () => {
  const stop = useRecoilValue(currentStopState);
  const dispatcher = useRecoilValue(dispatcherState);
  const isLoadingArrivals = useRecoilValue(loadingArrivalsState);

  const handleUpdatedStop = () => {
    if (!stop) return;

    // fetch upcoming arrivals when app comes back into foreground
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

  React.useEffect(handleUpdatedStop, [stop]);

  return (
    <View style={{ width: '100%', height: '100%' }}>
      <TopBanner stop={stop} />
      <View style={{ flex: 1, height: '100%', paddingBottom: 8 }}>
        <LoadingIndicator loading={isLoadingArrivals} />
        <ScrollView style={{ padding: 8, height: '100%', width: '100%' }}>
          <UpcomingArrivals />
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
