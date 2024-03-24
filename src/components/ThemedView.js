import React from 'react';
import { View } from 'react-native';
import { useTheme } from 'react-native-paper';

const ThemedView = ({ children, style, ...props }) => {
  const theme = useTheme();
  return (
    <View {...props} style={{ backgroundColor: theme.colors.background, ...style }}>
      {children}
    </View>
  );
};

export default ThemedView;
