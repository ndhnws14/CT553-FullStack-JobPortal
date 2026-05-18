import { io } from 'socket.io-client';

//const socket = io('http://localhost:8000', { withCredentials: true });

//deploy
const socket = io("https://geekjobs-api.onrender.com", {
  withCredentials: true
});

export default socket;
