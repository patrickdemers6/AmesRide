import * as Updates from 'expo-updates';
import localforage from 'localforage';
import { View } from 'react-native';

import RenderListItems from '../RenderListItems';

const SettingsAdvanced = () => {
  const clearData = async () => {
    localforage.clear();
    await Updates.reloadAsync();
  };

  const items = [
    {
      title: 'Clear Internal Data',
      description: 'Warning! This will delete favorite routes and stops.',
      handler: clearData,
    },
  ];

  return (
    <View style={{ padding: 8 }}>
      <RenderListItems items={items} />
    </View>
  );
};

export default SettingsAdvanced;
