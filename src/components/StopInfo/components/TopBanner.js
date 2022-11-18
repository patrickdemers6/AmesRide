import React from 'react';
import { View } from 'react-native';
import { Button, Menu, Text } from 'react-native-paper';
import GestureRecognizer from 'react-native-swipe-gestures';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useRecoilValue } from 'recoil';

import { dispatcherState, currentStopState, userSettingsState } from '../../../state/atoms';
import { isCurrentStopFavorite } from '../../../state/selectors';

const TopBanner = ({ stop }) => {
  const dispatcher = useRecoilValue(dispatcherState);
  const currentStopFavorite = useRecoilValue(isCurrentStopFavorite);
  const settings = useRecoilValue(userSettingsState);

  const [menuOpen, setMenuOpen] = React.useState(false);

  // used so text doesn't disappear when sliding out
  const [cached, setCached] = React.useState('');

  const toggleFilterSetting = () => {
    dispatcher?.toggleUserSetting('showFavoriteArrivalsOnly');
  };

  const openMenu = () => {
    setMenuOpen(true);
  };
  const closeMenu = () => {
    setMenuOpen(false);
  };

  const favoriteStop = () => {
    dispatcher?.toggleFavoriteStop(stop.RtpiNumber);
  };

  const storeStopNameInCache = () => {
    setCached(stop.Name);
  };

  const handleUpdatedStop = () => {
    if (!stop) return;

    storeStopNameInCache();
  };

  React.useEffect(handleUpdatedStop, [stop]);

  return (
    <GestureRecognizer onSwipeDown={dispatcher?.clearCurrentStop} style={{ width: '100%' }}>
      <View
        style={{
          backgroundColor: '#F1BE48',
          width: '100%',
          padding: 12,
          borderTopLeftRadius: 8,
          borderTopRightRadius: 8,
        }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            paddingLeft: 24,
            paddingRight: 12,
          }}>
          <Text style={{ width: '100%', float: 'left' }}>{stop?.Name || cached}</Text>
          <Menu
            visible={menuOpen}
            style={{ width: 250 }}
            anchor={
              <Button compact onPress={openMenu} color="black" style={{ margin: 0, padding: 0 }}>
                <Icon name="dots-vertical" onPress={openMenu} size={20} style={{ margin: 0 }} />
              </Button>
            }
            onDismiss={closeMenu}>
            <Menu.Item
              title={
                settings.showFavoriteArrivalsOnly ? 'Show all routes' : 'Show favorite routes only'
              }
              onPress={toggleFilterSetting}
            />
            <Menu.Item
              title={currentStopFavorite ? 'Unfavorite Stop' : 'Favorite stop'}
              onPress={favoriteStop}
            />
          </Menu>
        </View>
      </View>
    </GestureRecognizer>
  );
};

export default React.memo(TopBanner);
