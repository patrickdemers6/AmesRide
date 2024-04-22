import PropTypes from 'prop-types';
import { Pressable, View } from 'react-native';
import { IconButton, Text } from 'react-native-paper';
import { useRecoilValue } from 'recoil';

import { TOP_BAR_MAX_WIDTH } from '../../data/constants';
import { themeSelector } from '../../state/selectors';
import ThemedView from '../ThemedView';

const Bar = ({
  title,
  onPress,
  left,
  iconLeft,
  onIconLeft = () => {},
  right,
  iconRight,
  onIconRight = () => {},
}) => {
  const theme = useRecoilValue(themeSelector);
  const Left = left ?? <IconButton icon={iconLeft} onPress={onIconLeft} /> ?? null;
  const Right = right ?? <IconButton icon={iconRight} onPress={onIconRight} /> ?? null;

  return (
    <View style={{ marginHorizontal: '5%', flexDirection: 'column' }}>
      <View
        style={{
          width: '100%',
          marginTop: 8,
          height: 50,
          maxWidth: TOP_BAR_MAX_WIDTH,
          alignSelf: 'center',
        }}>
        <Pressable onPress={onPress}>
          <ThemedView
            style={{
              borderRadius: 25,
              borderWidth: 1,
              borderColor: theme.colors.outline,
              width: '100%',
              height: '100%',
            }}>
            <View
              style={{
                height: 45,
                flex: 1,
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <View
                style={{ flex: 1, display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                {Left}
                <View style={{ marginLeft: 8 }}>
                  <Text style={{ fontSize: 16 }}>{title}</Text>
                </View>
              </View>
              {Right}
            </View>
          </ThemedView>
        </Pressable>
      </View>
    </View>
  );
};

Bar.propTypes = {
  title: PropTypes.string.isRequired,
  onPress: PropTypes.func,
  left: PropTypes.element,
  iconLeft: PropTypes.string,
  onIconLeft: PropTypes.func,
  right: PropTypes.element,
  iconRight: PropTypes.string,
  onIconRight: PropTypes.func,
};

export default Bar;
