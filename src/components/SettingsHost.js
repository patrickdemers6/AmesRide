import React from 'react';
import { Modal, Platform, StatusBar, StyleSheet, View } from 'react-native';
import { IconButton, Text } from 'react-native-paper';
import { initialWindowMetrics, SafeAreaView } from 'react-native-safe-area-context';

import Settings from '../Settings';
import theme from '../styles/theme';
import SettingsAbout from './Settings/SettingsAbout';
import SettingsAdvanced from './Settings/SettingsAdvanced';
import SettingsContext from './settingsContext';

// Same reason as the route list: a stack push detaches Home and the map
// surface blanks. Settings stays in its own window.
export default function SettingsHost({ children }) {
  const [open, setOpen] = React.useState(false);
  const [screen, setScreen] = React.useState('Settings');
  const topInset =
    Platform.OS === 'android'
      ? StatusBar.currentHeight ?? initialWindowMetrics?.insets.top ?? 0
      : initialWindowMetrics?.insets.top ?? 0;

  const close = React.useCallback(() => {
    setOpen(false);
    setScreen('Settings');
  }, []);

  const back = React.useCallback(() => {
    if (screen === 'Settings') close();
    else setScreen('Settings');
  }, [close, screen]);

  const api = React.useMemo(
    () => ({
      open: () => {
        setScreen('Settings');
        setOpen(true);
      },
      close,
    }),
    [close]
  );

  return (
    <SettingsContext.Provider value={api}>
      {children}
      <Modal visible={open} animationType="fade" onRequestClose={back} statusBarTranslucent>
        <SafeAreaView
          edges={topInset > 0 ? ['bottom', 'left', 'right'] : ['top', 'bottom', 'left', 'right']}
          style={[styles.screen, { paddingTop: topInset }]}>
          <View style={styles.header}>
            <IconButton icon="arrow-left" onPress={back} />
            <Text style={styles.title}>{titles[screen]}</Text>
          </View>
          {screen === 'Settings' && <Settings onNavigate={setScreen} />}
          {screen === 'Settings/About' && <SettingsAbout />}
          {screen === 'Settings/Advanced' && <SettingsAdvanced />}
        </SafeAreaView>
      </Modal>
    </SettingsContext.Provider>
  );
}

const titles = {
  Settings: 'Settings',
  'Settings/About': 'About Ames Ride',
  'Settings/Advanced': 'Advanced',
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
  },
  title: {
    fontSize: 20,
  },
});
