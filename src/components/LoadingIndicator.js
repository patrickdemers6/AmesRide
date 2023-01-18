import React from 'react';
import * as Progress from 'react-native-progress';

const ProgressBar = (props) => {
  return (
    <Progress.Bar
      width={null}
      borderRadius={0}
      color="#C8102F"
      height={1}
      borderColor="white"
      style={{ backgroundColor: 'white', ...(props.styles || {}) }}
      {...props}
    />
  );
};

const LoadingIndicator = ({ loading }) => {
  if (loading) return <ProgressBar indeterminate indeterminateAnimationDuration={1000} />;

  return <ProgressBar progress={0} />;
};

export default LoadingIndicator;
