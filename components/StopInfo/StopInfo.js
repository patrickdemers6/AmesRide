import React from 'react';
import { useRecoilValue } from 'recoil';

import { currentStopState } from '../../state/atoms';
import BottomSheet from './components/BottomSheet';
import StopDetailsView from './components/StopDetailsView';

const StopInfo = () => {
  const info = useRecoilValue(currentStopState);

  return (
    <BottomSheet show={Boolean(info)}>
      <StopDetailsView />
    </BottomSheet>
  );
};

export default StopInfo;
