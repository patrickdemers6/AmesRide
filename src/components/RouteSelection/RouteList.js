import { useNavigation } from '@react-navigation/native';
import { ScrollView, useWindowDimensions } from 'react-native';
import { List } from 'react-native-paper';
import { useRecoilValue } from 'recoil';

import { dispatcherState } from '../../state/atoms';
import { routesSortedState } from '../../state/selectors';
import theme from '../../styles/theme';
import ColorCircle from '../ColorCircle';

const RouteList = ({ editing, checked, onEditPress }) => {
  const routes = useRecoilValue(routesSortedState);
  const dispatcher = useRecoilValue(dispatcherState);
  const navigation = useNavigation();
  const { width } = useWindowDimensions();

  const handleSelect = (index) => {
    if (index === 0) dispatcher?.updateCurrentRoute(null);
    else dispatcher?.updateCurrentRoute(index);
    navigation.goBack();
  };

  const onPress = editing ? onEditPress : handleSelect;

  return (
    <>
      <ScrollView>
        {(routes || []).map((route) => {
          let name = route.route_long_name;
          let number = route.route_long_name.split(' ')[0];
          if (number.length > 2) {
            number = null;
          } else {
            name = name.substring(number.length);
          }
          return (
            <List.Item
              title={name}
              style={{ alignContent: 'center', alignItems: 'center', justifyContent: 'center' }}
              key={route.route_id}
              onPress={() => onPress(route.route_id)}
              left={() => (
                <ColorCircle
                  largeText
                  size={30}
                  color={`#${route.route_color}`}
                  text={number}
                  style={{
                    marginLeft: width * 0.05,
                  }}
                />
              )}
              right={() =>
                editing && (
                  <List.Icon
                    color={theme.colors.backdrop}
                    icon={
                      checked.has(route.route_id) ? 'checkbox-marked' : 'checkbox-blank-outline'
                    }
                  />
                )
              }
            />
          );
        })}
      </ScrollView>
    </>
  );
};

export default RouteList;
