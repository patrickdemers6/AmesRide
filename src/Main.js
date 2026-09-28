import React from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useSetRecoilState } from 'recoil';

import Home from './components/Home';
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
      </Stack.Navigator>
    </SafeAreaProvider>
  );
}
