import { useNavigation } from '@react-navigation/native';
import { Linking } from 'react-native';

import RenderListItems from './components/RenderListItems';
import SettingsAbout from './components/Settings/SettingsAbout';
import Stack from './components/Stack';

const Settings = () => {
  const navigator = useNavigation();

  const openScreen = (screenName) => {
    navigator.push(screenName);
  };

  const items = [
    {
      title: 'Contact CyRide',
      description:
        'Contact CyRide for general questions or safety concerns. Please note, this app is not affiliated with CyRide.',
      handler: () => Linking.openURL('tel:5152921100'),
    },
    { title: 'About Ames Ride', handler: () => openScreen('Settings/About') },
    { title: 'Advanced', handler: () => openScreen('Settings/Advanced') },
  ];

  return (
    <>
      <Stack.Screen name="Settings/About" component={SettingsAbout} />
      <RenderListItems items={items} />
    </>
  );
};

export default Settings;
