import io from 'socket.io-client';

const HOST = 'https://testeinteractiplay.duckdns.org';

const socket = io(HOST + '/public', {
  transports: ['websocket'],
});

export default socket;
