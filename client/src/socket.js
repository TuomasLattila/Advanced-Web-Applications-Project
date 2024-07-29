//this is for keeping the chat in real-time:

import { io } from 'socket.io-client'
const URL = process.env.NODE_ENV === 'production' ? undefined : 'http://localhost:1234';

export const socket = io(URL, { autoConnect: false }) //exports the client side socet that connects to the server side io