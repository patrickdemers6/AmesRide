import React from 'react';
import { AppState } from 'react-native';
import { useRecoilValue } from 'recoil';
import { io } from 'socket.io-client';

import { currentStopState, dispatcherState } from '../state/atoms';
import { currentRoute } from '../state/selectors';

const Websocket = ({ children }) => {
  const dispatcher = useRecoilValue(dispatcherState);
  const [websocket, setWebsocket] = React.useState(null);
  const route = useRecoilValue(currentRoute);
  const stop = useRecoilValue(currentStopState);

  const appState = React.useRef(AppState.currentState);

  React.useEffect(() => {
    console.log('websocket changed');
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active' &&
        websocket.disconnected
      ) {
        dispatcher.setVehicleLocations(null);
        dispatcher.setUpcomingArrivals(null);
        dispatcher.setLoading(true);
        websocket.connect();
      }

      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, [websocket]);

  React.useEffect(() => {
    if (dispatcher) {
      setWebsocket((existing) => {
        if (existing) {
          existing.removeListener('connect');
          existing.on('connect', () => {
            dispatcher.setLoading(false);
            if (route?.route_id >= 0) subscribeRoute(existing);
            if (stop?.stop_id) subscribeStop(existing);
          });
          return existing;
        }

        const socket = io(process.env.EXPO_PUBLIC_BACKEND_HOST);
        socket.on('connect', () => {
          if (route?.route_id >= 0) subscribeRoute(socket);
          if (stop?.stop_id) subscribeStop(socket);
        });
        socket.on('disconnect', () => {
          dispatcher.setLoading(true);
        });
        socket.on(`vehicles-on-route`, (message) => {
          dispatcher.setVehicleLocations(message);
        });
        socket.on(`arrivals`, (message) => {
          dispatcher.setUpcomingArrivals(message);
        });
        return socket;
      });
    }
  }, [dispatcher, route, stop]);

  const subscribeRoute = (ws) => {
    if (!ws || ws.disconnected) return;

    if (route?.route_id >= 0) {
      ws.emit('subscribe-route', route.route_id);
    } else {
      ws.emit('unsubscribe-route');
    }
  };

  const subscribeStop = (ws) => {
    if (!ws || ws.disconnected) return;
    if (!stop?.stop_id) {
      ws.emit('unsubscribe-arrivals');
      return;
    }
    dispatcher.setUpcomingArrivals(null);
    ws.emit('subscribe-arrivals', stop.stop_id);
  };

  React.useEffect(() => {
    subscribeRoute(websocket);
  }, [route, websocket]);
  React.useEffect(() => {
    subscribeStop(websocket);
  }, [stop, websocket]);

  return children;
};

export default Websocket;
