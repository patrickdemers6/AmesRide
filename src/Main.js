import React from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useRecoilValue } from 'recoil';

import Settings from './Settings';
import Home from './components/Home';
import SelectRouteScreen from './components/SelectRouteScreen';
import SettingsAbout from './components/Settings/SettingsAbout';
import SettingsAdvanced from './components/Settings/SettingsAdvanced';
import SettingsAppearance from './components/Settings/SettingsAppearance';
import Stack from './components/Stack';
import { isDarkMode as isDarkModeSelector, themeSelector } from './state/selectors';

export default function Main() {
  const isDarkMode = useRecoilValue(isDarkModeSelector);
  const theme = useRecoilValue(themeSelector);

  const backgroundColor = theme.colors.background;
  const screenOptions = {
    animation: 'fade',
    headerStyle: { backgroundColor },
    headerTitleStyle: { color: theme.colors.text },
  };
  if (isDarkMode) {
    screenOptions.headerTintColor = 'white';
  }

  return (
    <SafeAreaProvider>
      <StatusBar
        backgroundColor={backgroundColor}
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
      />
      <Stack.Navigator screenOptions={screenOptions}>
        <Stack.Screen name="Home" component={Home} options={{ headerShown: false }} />
        <Stack.Screen
          name="SelectRoute"
          component={SelectRouteScreen}
          options={{ headerShown: false }}
        />
        <Stack.Group>
          <Stack.Screen name="Settings" component={Settings} />
          <Stack.Screen
            name="Settings/About"
            component={SettingsAbout}
            options={{ title: 'About Ames Ride' }}
          />
          <Stack.Screen
            name="Settings/Appearance"
            component={SettingsAppearance}
            options={{ title: 'Appearance' }}
          />
          <Stack.Screen
            name="Settings/Advanced"
            component={SettingsAdvanced}
            options={{ title: 'Advanced' }}
          />
        </Stack.Group>
      </Stack.Navigator>
    </SafeAreaProvider>
  );
}
