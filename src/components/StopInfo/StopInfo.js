import React from 'react';
import { Portal } from 'react-native-paper';
import { useRecoilValue } from 'recoil';

import BottomSheet from './components/BottomSheet';
import StopDetailsView from './components/StopDetailsView';
import { currentStopState } from '../../state/atoms';

const StopInfo = () => {
  const info = useRecoilValue(currentStopState);
  return (
    <Portal>
      <BottomSheet show={Boolean(info)}>
        <StopDetailsView />
      </BottomSheet>
    </Portal>
  );
};

export default StopInfo;
