import { ScrollView, useWindowDimensions } from 'react-native';
import { Button } from 'react-native-paper';

import { TOP_BAR_MAX_WIDTH } from '../../data/constants';

const QuickSelect = ({ items, style }) => {
  const { width } = useWindowDimensions();
  const isFullWidth = width <= TOP_BAR_MAX_WIDTH;
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      decelerationRate="fast"
      overScrollMode="never"
      fadingEdgeLength={isFullWidth ? 0 : 16}
      style={{
        maxWidth: TOP_BAR_MAX_WIDTH,
        marginLeft: isFullWidth ? 0 : (width - TOP_BAR_MAX_WIDTH) / 2,
        ...style,
      }}>
      {items.map(({ name, icon, id, onPress }, i, arr) => (
        <Button
          mode="elevated"
          compact
          key={name}
          onPress={() => onPress(id)}
          icon={icon}
          buttonColor="white"
          textColor="black"
          style={{
            margin: 3,
            marginLeft: i === 0 && isFullWidth ? width * 0.05 : 2,
            marginRight: i === arr.length - 1 && isFullWidth ? width * 0.05 : 2,
          }}>
          {name}
          {/* HACK: prevents truncation */}
          {name.length === 10 ? ' ' : ''}
        </Button>
      ))}
    </ScrollView>
  );
};

export default QuickSelect;
