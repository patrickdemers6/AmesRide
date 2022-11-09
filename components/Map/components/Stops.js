import { useRecoilValue } from 'recoil';

import { favoriteStopsState } from '../../../state/atoms';
import { currentRouteStopDetailsState, favoriteStopDetailsState } from '../../../state/selectors';
import StopView from './StopView';

const Stops = ({ onPress }) => {
  const favoriteStopIDs = useRecoilValue(favoriteStopsState);
  const favoriteStopDetails = useRecoilValue(favoriteStopDetailsState);
  const stops = useRecoilValue(currentRouteStopDetailsState);

  if (stops && stops.length > 0) {
    return (
      <>
        {stops.map((s) => (
          <StopView
            key={s.ID}
            stop={s}
            onPress={onPress}
            favorite={favoriteStopIDs.has(s.RtpiNumber)}
          />
        ))}
      </>
    );
  }

  if (favoriteStopDetails && favoriteStopDetails.length > 0) {
    return (
      <>
        {favoriteStopDetails.map((s) => (
          <StopView key={s.ID} stop={s} onPress={onPress} favorite />
        ))}
      </>
    );
  }

  return null;
};

export default Stops;
