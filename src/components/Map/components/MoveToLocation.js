import React from 'react';
import { FAB, Portal } from 'react-native-paper';
import { useRecoilValue } from 'recoil';

import { currentStopState } from '../../../state/atoms';

const MoveToLocation = ({ onPress, show, dark }) => {
  const selectedStop = useRecoilValue(currentStopState);

  return (
    <Portal>
      <FAB
        visible={show && !selectedStop}
        onPress={onPress}
        style={{
          zIndex: 100,
          position: 'absolute',
          bottom: 0,
          right: 0,
          margin: 16,
          backgroundColor: dark ? '#0f0f0f' : 'white',
        }}
        icon="crosshairs-gps"
      />
    </Portal>
  );
};

export default MoveToLocation;
