import React from 'react';
import Svg, { Path } from 'react-native-svg';
import { useRecoilValue } from 'recoil';

import { favoriteStopsState } from '../../../state/atoms';
import { currentRouteStopDetailsState, favoriteStopDetailsState } from '../../../state/selectors';
import ImagePin from './ImagePin';

const Stops = ({ onPress }) => {
  const favoriteStopIDs = useRecoilValue(favoriteStopsState);
  const favoriteStopDetails = useRecoilValue(favoriteStopDetailsState);
  const stops = useRecoilValue(currentRouteStopDetailsState);

  if (stops && stops.length > 0) {
    return stops.map((s, i) => {
      const isFavorite = favoriteStopIDs.has(s.RtpiNumber);
      // the seprate rendering of ImagePin is required to ensure a rerender of the element
      // otherwise performance will be 0 fps
      if (isFavorite)
        return (
          <ImagePin
            key={s.ID + 'f' + i}
            details={s}
            sizeMultiplier={1}
            onPress={onPress}
            favorite={isFavorite}>
            <FavoriteImage />
          </ImagePin>
        );
      return (
        <ImagePin
          key={s.ID + ' ' + i}
          details={s}
          sizeMultiplier={1}
          onPress={onPress}
          favorite={isFavorite}>
          <StopImage />
        </ImagePin>
      );
    });
  }

  if (favoriteStopDetails && favoriteStopDetails.length > 0) {
    return favoriteStopDetails.map((s, i) => (
      <ImagePin key={s.ID + ' ' + i} details={s} onPress={onPress} favorite>
        <FavoriteImage width={25} height={25} />
      </ImagePin>
    ));
  }

  return null;
};

const StopImage = (props) => (
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

const FavoriteImage = (props) => (
  <Svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width={25} height={25} {...props}>
    <Path
      d="M479.9 182.6q16.6 2.7 16.6 13.9 0 6.6-7.7 14.4L381 317.6l25.6 150.6q.2 2.1.3 6 0 6.3-3.2 10.7-3.1 4.4-9 4.4-5.7 0-11.9-3.6l-133.3-71.1-133.3 71.1q-6.5 3.6-11.9 3.6-6.2 0-9.3-4.4-3.1-4.4-3.1-10.7 0-1.8.5-6L118 317.6 9.9 210.9q-7.4-8.1-7.4-14.4 0-11.2 16.6-13.9l149.1-22L235 23.5q5.6-12.3 14.5-12.3T264 23.5l66.8 137.1 149.1 22z"
      style={{
        fill: 'gray',
      }}
    />
    <Path
      d="M404.8 204.6q11.2 1.9 11.2 9.4 0 4.4-5.2 9.7l-72.6 71.9 17.2 101.5q.2 1.5.2 4.1 0 4.3-2.1 7.2-2.1 3-6.1 3-3.8 0-8-2.5L249.5 361l-89.9 47.9q-4.4 2.5-8 2.5-4.2 0-6.3-3-2.1-2.9-2.1-7.2 0-1.2.4-4.1l17.2-101.5L88 223.7q-5-5.5-5-9.7 0-7.5 11.2-9.4l100.5-14.8 45-92.4q3.8-8.3 9.8-8.3 6 0 9.8 8.3l45 92.4 100.5 14.8z"
      style={{
        fill: '#fff',
      }}
    />
  </Svg>
);

export default Stops;
