import io from 'socket.io-client'

export const SOCKET_EVENTS = {
  CONNECT: 'connect',
  DISCONNECT: 'disconnect',
  CONNECT_ERROR: 'connect_error',
  // Server emits these to Client
  S2C: {
    USER_CONNECTED: 'user_connected',
    USER_DISCONNECTED: 'user_disconnected',
    CHALLENGES_STATUS: 'challenges_status',
    SESSION: 'session',
    NEW_CHAT_MESSAGE: 'new_chat_message',
  },
  // Clients emits these to the Server
  C2S: {
    CHALLENGE: 'challenge',
    ACCEPT_CHALLENGE: 'accept_challenge',
    DECLINE_CHALLENGE: 'decline_challenge',
    POST_CHAT_MESSAGE: 'post_chat_message',
  },
}

const serverURL = 'http://localhost:1337'

const socket = io(serverURL, { autoConnect: false })

export default socket
