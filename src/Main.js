import React from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useSetRecoilState } from 'recoil';

import Settings from './Settings';
import Home from './components/Home';
import SelectRouteScreen from './components/SelectRouteScreen';
import SettingsAbout from './components/Settings/SettingsAbout';
import SettingsAdvanced from './components/Settings/SettingsAdvanced';
import Stack from './components/Stack';
import { dispatcherState } from './state/atoms';
import { createDispatcher } from './state/dispatcher';

export default function Main() {
  const dispatcherRef = React.useRef(createDispatcher());
  const setDispatcher = useSetRecoilState(dispatcherState);

  React.useEffect(() => {
    setDispatcher(dispatcherRef.current);
  }, []);

  return (
    <SafeAreaProvider>
      <StatusBar backgroundColor="white" barStyle="dark-content" />
      <Stack.Navigator screenOptions={{ animation: 'fade' }}>
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
            name="Settings/Advanced"
            component={SettingsAdvanced}
            options={{ title: 'Advanced' }}
          />
        </Stack.Group>
      </Stack.Navigator>
    </SafeAreaProvider>
  );
}
