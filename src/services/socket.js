import { io } from 'socket.io-client';

// "undefined" means the URL will be computed from the `window.location` object
const URL = process.env.NODE_ENV === 'production' ? undefined : 'ws://localhost:3000/admin';

export const getSocket = (authToken, name) =>
  io(URL || '', {
    reconnectionDelayMax: 10000,
    autoConnect: false,
    query: {
      authToken,
      name: name.toLowerCase(),
    },
    transports: ['websocket', 'polling'],
  });
