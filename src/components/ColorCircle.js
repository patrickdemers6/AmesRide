import Color from 'color';
import { Text, View } from 'react-native';

const ColorCircle = ({ color, size, text, style, largeText }) => {
  return (
    <View
      style={{
        backgroundColor: color,
        width: size,
        height: size,
        borderRadius: size / 2,
        alignContent: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        ...style,
      }}>
      <Text
        style={{
          color: Color(color).isDark() ? 'white' : 'black',
          fontSize: Math.round(size * (largeText ? 0.65 : 0.45)),
        }}>
        {text}
      </Text>
    </View>
  );
};

export default ColorCircle;
