import React from 'react';
import Svg, { Path } from 'react-native-svg';

const RegularStopImage = (props) => (
  <Svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width={25} height={25} {...props}>
    <Path
      d="M49.5 98C22.7 98 1 76.3 1 49.5S22.7 1 49.5 1 98 22.7 98 49.5 76.3 98 49.5 98z"
      style={{
        fill: 'gray',
      }}
    />
    <Path
      d="M49.8 80.6C32.4 80.8 18.2 67 18 49.8c-.2-17.2 13.8-31.3 31.2-31.4C66.6 18.2 80.8 32 81 49.2c.2 17.2-13.8 31.3-31.2 31.4z"
      style={{
        fill: '#fff',
      }}
    />
  </Svg>
);

export default React.memo(RegularStopImage);
