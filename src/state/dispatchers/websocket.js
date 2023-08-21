import { websocketState } from '../atoms';

export const setWebsocket =
  ({ set }) =>
  async (websocket) => {
    set(websocketState, websocket);
  };
