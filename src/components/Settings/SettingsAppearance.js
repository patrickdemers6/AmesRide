import { GestureHandlerRootView, ScrollView } from 'react-native-gesture-handler';
import { List, Switch } from 'react-native-paper';
import { useRecoilValue } from 'recoil';

import { dispatcherState } from '../../state/atoms';
import { isDarkMode as isDarkModeSelector } from '../../state/selectors';

const SettingsAppearance = () => {
  const isDarkMode = useRecoilValue(isDarkModeSelector);
  const dispatcher = useRecoilValue(dispatcherState);
  const toggleDarkMode = () => {
    dispatcher.setUserSetting('theme', isDarkMode ? 'light' : 'dark');
  };
  return (
    <GestureHandlerRootView>
      <ScrollView>
        <List.Item
          title="Color Theme"
          description={isDarkMode ? 'Dark mode' : 'Light mode'}
          right={() => <Switch value={isDarkMode} onChange={toggleDarkMode} />}
        />
      </ScrollView>
    </GestureHandlerRootView>
  );
};

export default SettingsAppearance;
