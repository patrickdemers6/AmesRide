import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { FAB } from 'react-native-paper';
import { useRecoilValue } from 'recoil';

import { currentStopState } from '../../state/atoms';
const Settings = () => {
  const selectedStop = useRecoilValue(currentStopState);
  const navigation = useNavigation();

  const navigateToSettings = () => {
    navigation.push('Settings');
  };

  return (
    <FAB
      visible={!selectedStop}
      onPress={navigateToSettings}
      style={{
        zIndex: 100,
        position: 'absolute',
        bottom: 0,
        right: 0,
        margin: 16,
        backgroundColor: '#C8102F',
      }}
      color="#F1BE48"
      icon="cog"
    />
  );
};
export default Settings;
