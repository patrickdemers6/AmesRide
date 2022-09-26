import { useRecoilCallback } from 'recoil';

import { currentStopState, upcomingArrivalsState } from '../atoms';

/*  eslint react-hooks/rules-of-hooks: "off" */

export const clearCurrentStop = useRecoilCallback(({ set }) => () => {
  set(currentStopState, null);
});

export const setCurrentStop = useRecoilCallback(({ set }) => (stop) => {
  set(currentStopState, { ...stop });
});

export const fetchUpcomingStops = useRecoilCallback(({ set }) => (stop) => {
  fetch(`https://www.mycyride.com/Stop/${stop.ID}/Arrivals`)
    .then((result) => result.json())
    .then((json) => {
      set(upcomingArrivalsState, json);
    });
});
