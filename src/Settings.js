import { Linking } from 'react-native';

import RenderListItems from './components/RenderListItems';

const Settings = ({ onNavigate }) => {
  const openScreen = (screenName) => {
    onNavigate(screenName);
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

  return <RenderListItems items={items} />;
};

export default Settings;
