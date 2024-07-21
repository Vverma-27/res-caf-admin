import { io } from 'socket.io-client';

// "undefined" means the URL will be computed from the `window.location` object
const URL =
  import.meta.env.NODE_ENV === 'production'
    ? undefined
    : `${import.meta.env.VITE_ADMIN_API_ROUTE}/admin`;

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
