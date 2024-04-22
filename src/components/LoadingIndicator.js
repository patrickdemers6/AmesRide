import React from 'react';
import * as Progress from 'react-native-progress';
import { useRecoilValue } from 'recoil';

import { themeSelector } from '../state/selectors';

const ProgressBar = (props) => {
  const theme = useRecoilValue(themeSelector);
  return (
    <Progress.Bar
      width={null}
      borderRadius={0}
      color="#C8102F"
      height={1}
      borderColor={theme.colors.background}
      style={{ backgroundColor: theme.colors.background, ...(props.styles || {}) }}
      {...props}
    />
  );
};

const LoadingIndicator = ({ loading }) => {
  if (!loading) return null;
  return <ProgressBar indeterminate indeterminateAnimationDuration={1000} />;
};

export default LoadingIndicator;
