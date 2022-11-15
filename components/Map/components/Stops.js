import React from 'react';
import { useRecoilValue } from 'recoil';

import { favoriteStopsState } from '../../../state/atoms';
import { currentRouteStopDetailsState, favoriteStopDetailsState } from '../../../state/selectors';
import FavoriteStopImage from '../../icons/FavoriteStopImage';
import RegularStopImage from '../../icons/RegularStopImage';
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
            <FavoriteStopImage />
          </ImagePin>
        );
      return (
        <ImagePin
          key={s.ID + ' ' + i}
          details={s}
          sizeMultiplier={1}
          onPress={onPress}
          favorite={isFavorite}>
          <RegularStopImage />
        </ImagePin>
      );
    });
  }

  if (favoriteStopDetails && favoriteStopDetails.length > 0) {
    return favoriteStopDetails.map((s, i) => (
      <ImagePin key={s.ID + ' ' + i} details={s} onPress={onPress} favorite>
        <FavoriteStopImage width={25} height={25} />
      </ImagePin>
    ));
  }

  return null;
};

export default Stops;
