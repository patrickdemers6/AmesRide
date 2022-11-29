import * as Clipboard from 'expo-clipboard';
import Constants from 'expo-constants';
import { Linking, Share, ToastAndroid, View } from 'react-native';
import { Text } from 'react-native-paper';

import RenderListItems from '../RenderListItems';

const SettingsAbout = () => {
  const projectUrl = 'https://github.com/patrickdemers6/AmesRide';

  const versionNumber = Constants.expoConfig?.version || 'Unknown';

  const setVersionOnClipboard = async () => {
    await Clipboard.setStringAsync(`Ames Ride Version: ${versionNumber}`);
    ToastAndroid.show('Copied to clipboard', ToastAndroid.SHORT);
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message:
          'Ames Ride | A quick, reliable, and accurate bus app serving Ames, IA.\n\nGet it on Google Play\nhttps://play.google.com/store/apps/details?id=com.demerstech.amesride',
      });
    } catch (e) {
      console.error(e);
      ToastAndroid.show('Share app failed.', ToastAndroid.SHORT);
    }
  };

  const items = [
    {
      title: 'Contact Developer',
      description: "Found a bug or have a suggestion? Let's chat!",
      handler: () =>
        Linking.openURL(
          `mailto:patrickdemers6@gmail.com?subject=Ames%20Ride&body=Version: ${versionNumber}\n\n`
        ),
    },
    {
      title: 'View on GitHub',
      description: projectUrl,
      handler: () => Linking.openURL(projectUrl),
    },
    { title: 'Share', handler: handleShare },
    {
      title: 'Version',
      description: versionNumber,
      handler: () => {},
      holdHandler: setVersionOnClipboard,
    },
  ];

  return (
    <View style={{ padding: 8 }}>
      <Text>
        Ames Ride is an open source project founded by Iowa State University Software Engineering
        student Patrick Demers. The goal of the app is to serve Ames bus riders by providing
        information quickly, reliably, and accurately.
      </Text>
      <RenderListItems items={items} />
    </View>
  );
};

export default SettingsAbout;
