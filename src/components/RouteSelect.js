import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { SafeAreaView, View } from 'react-native';
import { Portal } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useRecoilValue } from 'recoil';

import ColorCircle from './ColorCircle';
import LoadingIndicator from './LoadingIndicator';
import Bar from './RouteSelection/Bar';
import QuickSelect from './RouteSelection/QuickSelect';
import { currentRouteRowState, dispatcherState, loadingVehiclesState } from '../state/atoms';
import { ALL_ROUTES, FAVORITE_STOPS } from '../state/constants';
import {
  currentRoute,
  favoriteRoutesOnlyState,
  favoriteStopDetailsState,
  isDataEmpty,
  themeSelector,
} from '../state/selectors';

const RouteSelect = () => {
  const dispatcher = useRecoilValue(dispatcherState);
  const favoriteRoutes = useRecoilValue(favoriteRoutesOnlyState);
  const favoriteStops = useRecoilValue(favoriteStopDetailsState);
  const activeRoute = useRecoilValue(currentRouteRowState);
  const currentRouteInfo = useRecoilValue(currentRoute);
  const navigation = useNavigation();
  const theme = useRecoilValue(themeSelector);
  const loading = useRecoilValue(loadingVehiclesState);
  const dataEmpty = useRecoilValue(isDataEmpty);

  const handleSelect = (index) => {
    if (index === activeRoute) {
      return;
    }
    if (index === 0) dispatcher?.updateCurrentRoute(null);
    else dispatcher?.updateCurrentRoute(index);
  };

  const handleStopSelect = (id) => {
    dispatcher?.setCurrentStop(id);
  };
  const routesQuickSelect = (favoriteRoutes ?? []).map((r) => ({
    name: r.route_long_name,
    id: r.route_id,
    icon: 'routes',
    onPress: handleSelect,
  }));

  const stops = (favoriteStops ?? []).map((r) => ({
    name: r.stop_name,
    id: r,
    icon: 'bus-stop',
    onPress: handleStopSelect,
  }));

  let name = currentRouteInfo.route_long_name;
  let circleContent = currentRouteInfo.route_long_name?.split(' ')[0];
  if (dataEmpty) {
    name = 'Loading';
    circleContent = <Icon name="sync" size={20} />;
  } else if (currentRouteInfo.route_id === FAVORITE_STOPS) {
    name = 'Favorite stops';
    circleContent = <Icon name="star" size={20} />;
  } else if (currentRouteInfo.route_id === ALL_ROUTES) {
    name = 'Select a route';
    circleContent = <Icon name="routes" size={20} />;
  } else if (circleContent.length > 2) {
    circleContent = null;
  } else {
    name = name?.substring(circleContent.length);
  }

  const items = [
    ...routesQuickSelect,
    ...stops,
    {
      name: 'All Routes',
      icon: 'routes',
      onPress: handleSelect,
      id: ALL_ROUTES,
    },
  ];
  const favoriteStopsItem = {
    icon: 'star',
    name: 'Stops',
    onPress: handleSelect,
    id: FAVORITE_STOPS,
  };
  if (favoriteStops && favoriteStops.length > 0) {
    items.push(favoriteStopsItem);
  }

  React.useEffect(() => {
    const favoriteStopsIsSelected = activeRoute === FAVORITE_STOPS;
    if (favoriteStops?.length === 0 && favoriteStopsIsSelected) {
      dispatcher.updateCurrentRoute(ALL_ROUTES);
    }
  }, [favoriteStops]);

  return (
    <>
      <Portal>
        <LoadingIndicator loading={loading} />
      </Portal>
      <Portal>
        <SafeAreaView>
          <Bar
            onPress={() => navigation.navigate('SelectRoute')}
            title={name}
            left={
              <ColorCircle
                color={
                  currentRouteInfo.route_color
                    ? `#${currentRouteInfo.route_color}`
                    : theme.colors.background
                }
                size={45}
                style={{
                  borderWidth: 2,
                  borderColor: theme.colors.background,
                  marginLeft: 2.5,
                  marginRight: 5,
                }}
                text={circleContent}
              />
            }
            iconRight="cog"
            onIconRight={() => navigation.navigate('Settings')}
          />
          <View>
            <QuickSelect items={items} style={{ paddingVertical: 4 }} />
          </View>
        </SafeAreaView>
      </Portal>
    </>
  );
};

export default React.memo(RouteSelect);
