import io from 'socket.io-client'

export const SOCKET_EVENTS = {
  SESSION: 'session',
  USERS: 'users',
  USER_CONNECTED: 'user_connected',
  DISCONNECT: 'disconnect',
  GET_ALL_USERS: 'get_all_users',
  USER_DISCONNECTED: 'user_disconnected',
  CONNECT: 'connect',
  CONNECT_ERROR: 'connect_error',
  CHALLENGE: 'challenge',
  CHALLENGED: 'challenged',
}

const serverURL = 'http://localhost:1337'

const socket = io(serverURL, { autoConnect: false })

export default socket