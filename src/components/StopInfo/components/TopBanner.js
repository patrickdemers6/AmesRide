import React from 'react';
import { View } from 'react-native';
import { IconButton, Menu, Text } from 'react-native-paper';
import GestureRecognizer from 'react-native-swipe-gestures';
import { useRecoilValue } from 'recoil';

import { dispatcherState, userSettingsState } from '../../../state/atoms';
import { isCurrentStopFavorite } from '../../../state/selectors';

const TopBanner = ({ stop }) => {
  const dispatcher = useRecoilValue(dispatcherState);
  const currentStopFavorite = useRecoilValue(isCurrentStopFavorite);
  const settings = useRecoilValue(userSettingsState);

  const [menuOpen, setMenuOpen] = React.useState(false);

  // when the drawer closes, the stop name disappears
  // this cache holds the name to ensure the ui shows stop name as drawer slides away
  const [cached, setCached] = React.useState('');

  const storeStopNameInCache = () => {
    setCached(stop.stop_name);
  };

  const handleUpdatedStop = () => {
    if (!stop) return;

    storeStopNameInCache();
  };

  React.useEffect(handleUpdatedStop, [stop]);

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
    dispatcher?.toggleFavoriteStop(stop.stop_id);
  };

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
          <Text style={{ width: '100%' }}>{stop?.stop_name || cached}</Text>
          <Menu
            visible={menuOpen}
            style={{ width: 250 }}
            anchor={
              <IconButton
                icon="dots-vertical"
                compact
                onPress={openMenu}
                color="black"
                style={{ margin: 0, padding: 0, backgroundColor: '#F1BE48' }}
              />
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
