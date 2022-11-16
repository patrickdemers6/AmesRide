import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet } from 'react-native';

const BottomSheet = ({ show, children }) => {
  const animatedValue = useRef(new Animated.Value(1)).current;

  const startAnimation = (toValue) => {
    Animated.timing(animatedValue, {
      toValue,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };

  useEffect(() => {
    startAnimation(show ? 0 : 1);
  }, [show]);

  const translateY = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 300],
    extrapolate: 'clamp',
  });

  return (
    <Animated.View style={[styles.container, { transform: [{ translateY }] }]}>
      {children}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    width: '100%',
    height: 300,
    bottom: 0,
    left: 0,
    position: 'absolute',
    zIndex: 100,
    backgroundColor: 'white',
  },
});

export default BottomSheet;
