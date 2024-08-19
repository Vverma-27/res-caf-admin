import { io } from 'socket.io-client';

// "undefined" means the URL will be computed from the `window.location` object
const URL = import.meta.env.PROD
  ? 'https://admin.api.resandcaf.online/admin-resandcaf-'
  : `${import.meta.env.VITE_ADMIN_API_ROUTE}/admin-resandcaf-`;

export const getSocket = (authToken, name) => {
  if (!authToken) return null;
  return io(`${URL}${name.toLowerCase()}` || '', {
    reconnectionDelayMax: 10000,
    autoConnect: false,
    query: {
      authToken,
      name: name.toLowerCase(),
    },
    transports: ['websocket', 'polling'],
  });
};
