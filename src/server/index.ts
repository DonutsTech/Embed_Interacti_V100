import io from 'socket.io-client';

const HOST = 'http://localhost:4000';

const socket = io(HOST + '/public', {
  transports: ['websocket'],
});

export default socket;
