import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { SafeAreaView } from 'react-native';
import { IconButton, Menu } from 'react-native-paper';
import { useRecoilValue } from 'recoil';

import Bar from './RouteSelection/Bar';
import RouteList from './RouteSelection/RouteList';
import { dispatcherState, favoriteRoutesState } from '../state/atoms';

const SelectRouteScreen = () => {
  const navigation = useNavigation();
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
      <SafeAreaView style={{ flex: 1 }}>
        <Bar
          iconLeft="arrow-left"
          onIconLeft={navigation.goBack}
          iconRight={editFavorites && 'check'}
          onIconRight={editFavorites ? toggleEditFavorites : null}
          title={editFavorites ? 'Select favorite routes' : 'Select a route'}
          right={
            !editFavorites ? (
              <Menu
                visible={menuOpen}
                onDismiss={closeMenu}
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
