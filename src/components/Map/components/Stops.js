import React from 'react';
import { useRecoilValue } from 'recoil';

import ImagePin from './ImagePin';
import { dispatcherState, favoriteStopsState } from '../../../state/atoms';
import { stopsInCurrentTripSelector, favoriteStopDetailsState } from '../../../state/selectors';
import FavoriteStopImage from '../../icons/FavoriteStopImage';
import RegularStopImage from '../../icons/RegularStopImage';

/**
 * Renders all stops on the map for the given trip.
 */
const Stops = () => {
  const stops = useRecoilValue(stopsInCurrentTripSelector);
  const favoriteStops = useRecoilValue(favoriteStopDetailsState);
  const favoriteStopIds = useRecoilValue(favoriteStopsState);

  const dispatcher = useRecoilValue(dispatcherState);
  const setActiveStop = (stop) => {
    dispatcher.setCurrentStop(stop);
  };

  if (stops) {
    return stops.map((s, i) => {
      const isFavorite = favoriteStopIds.has(s.stop_id);
      // the seprate rendering of ImagePin is required to ensure a re-render of the element
      // otherwise performance will be 0 fps
      if (isFavorite)
        return (
          <ImagePin
            key={s.stop_id + 'f' + i}
            details={s}
            sizeMultiplier={1}
            onPress={setActiveStop}
            favorite={isFavorite}>
            <FavoriteStopImage />
          </ImagePin>
        );
      return (
        <ImagePin
          key={s.stop_id + ' ' + i}
          details={s}
          sizeMultiplier={1}
          onPress={setActiveStop}
          favorite={isFavorite}>
          <RegularStopImage />
        </ImagePin>
      );
    });
  }

  if (favoriteStops) {
    return favoriteStops.map((s, i) => (
      <ImagePin key={s.stop_id + ' ' + i} details={s} onPress={setActiveStop} favorite>
        <FavoriteStopImage width={25} height={25} />
      </ImagePin>
    ));
  }

  return null;
};

export default React.memo(Stops);
