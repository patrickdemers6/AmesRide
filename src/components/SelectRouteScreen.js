import React from 'react';
import { IconButton, Menu } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRecoilValue } from 'recoil';

import Bar from './RouteSelection/Bar';
import RouteList from './RouteSelection/RouteList';
import { useRoutePicker } from './routePickerContext';
import { dispatcherState, favoriteRoutesState } from '../state/atoms';
import theme from '../styles/theme';

const SelectRouteScreen = ({ topInset = 0 }) => {
  const routePicker = useRoutePicker();
  const dispatcher = useRecoilValue(dispatcherState);
  const favoriteRoutes = useRecoilValue(favoriteRoutesState);
  const [editFavorites, setEditFavorites] = React.useState();
  const [menuOpen, setMenuOpen] = React.useState();

  const openMenu = () => setMenuOpen(true);
  const closeMenu = () => setMenuOpen(false);

  const toggleEditFavorites = () => {
    closeMenu();
    setEditFavorites((s) => !s);
  };

  return (
    <>
      <SafeAreaView
        edges={topInset > 0 ? ['bottom', 'left', 'right'] : ['top', 'bottom', 'left', 'right']}
        style={{ flex: 1, paddingTop: topInset, backgroundColor: theme.colors.background }}>
        <Bar
          iconLeft="arrow-left"
          onIconLeft={routePicker.close}
          iconRight={editFavorites && 'check'}
          onIconRight={editFavorites ? toggleEditFavorites : null}
          title={editFavorites ? 'Select favorite routes' : 'Select a route'}
          right={
            !editFavorites ? (
              <Menu
                visible={menuOpen}
                onDismiss={closeMenu}
                statusBarHeight={0}
                anchor={<IconButton icon="dots-vertical" onPress={openMenu} />}>
                <Menu.Item title="Edit Favorites" onPress={toggleEditFavorites} />
              </Menu>
            ) : null
          }
        />
        <RouteList
          onEditPress={dispatcher?.toggleFavoriteRoute}
          editing={editFavorites}
          checked={favoriteRoutes}
        />
      </SafeAreaView>
    </>
  );
};

export default SelectRouteScreen;
