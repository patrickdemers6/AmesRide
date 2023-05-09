import React from 'react';
import { ScrollView, View } from 'react-native';
import { useRecoilValue } from 'recoil';

import { currentStopState } from '../../../state/atoms';
import TopBanner from './TopBanner';
import UpcomingArrivals from './UpcomingArrivals';

const StopDetailsView = () => {
  const stop = useRecoilValue(currentStopState);

  return (
    <View style={{ width: '100%', height: '100%' }}>
      <TopBanner stop={stop} />
      <View style={{ flex: 1, height: '100%', paddingBottom: 8 }}>
        <ScrollView style={{ padding: 8, height: '100%', width: '100%' }}>
          <UpcomingArrivals />
        </ScrollView>
      </View>
    </View>
  );
};

export default StopDetailsView;
