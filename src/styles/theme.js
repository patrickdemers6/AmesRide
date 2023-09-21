import Color from 'color';
import { configureFonts } from 'react-native-paper';

const theme = {
  dark: false,
  roundness: 4,
  colors: {
    primary: '#6200ee',
    accent: '#03dac4',
    background: '#f6f6f6',
    surface: '#ffffff',
    error: '#B00020',
    text: '#7D7D7D',
    onSurface: '#1c1b1f',
    disabled: Color('#000').alpha(0.26).rgb().string(),
    placeholder: Color('#000').alpha(0.54).rgb().string(),
    backdrop: Color('#000').alpha(0.5).rgb().string(),
    notification: '#f50057',
    elevation: {
      level0: '#fff',
      level1: '#fff',
      level2: '#fff',
      level3: '#fff',
      level4: '#fff',
      level5: '#fff',
    },
  },
  fonts: configureFonts(),
  animation: {
    scale: 1.0,
  },
};

export default theme;
