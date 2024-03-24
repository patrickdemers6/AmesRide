import React from 'react';
import { ScrollView, View } from 'react-native';
import { useRecoilValue } from 'recoil';

import TopBanner from './TopBanner';
import UpcomingArrivals from './UpcomingArrivals';
import { currentStopState } from '../../../state/atoms';
import ThemedView from '../../ThemedView';

const StopDetailsView = () => {
  const stop = useRecoilValue(currentStopState);

  return (
    <View style={{ width: '100%', height: '100%', backgroundColor: 'transparent' }}>
      <TopBanner stop={stop} />
      <ThemedView style={{ flex: 1, height: '100%', paddingBottom: 8 }}>
        <ScrollView style={{ padding: 8, height: '100%', width: '100%' }}>
          <UpcomingArrivals />
        </ScrollView>
      </ThemedView>
    </View>
  );
};

export default StopDetailsView;
