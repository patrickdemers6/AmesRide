import { ScrollView, useWindowDimensions } from 'react-native';
import { Button } from 'react-native-paper';

const QuickSelect = ({ items, style }) => {
  const { width } = useWindowDimensions();
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      decelerationRate="fast"
      overScrollMode="never"
      style={{ alignSelf: 'center', ...style }}>
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
            marginLeft: i === 0 ? width * 0.05 : 2,
            marginRight: i === arr.length - 1 ? width * 0.05 : 2,
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
