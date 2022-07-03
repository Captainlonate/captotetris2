/*
  Socket.IO Server
*/
import http from 'http'
import { Server } from 'socket.io'

import SessionStore, { UserSession } from './database/SessionStore'
import { SOCKET_EVENTS } from './lib/SocketIOEvents'
import { ISocketIOSocket } from './socketioServer.d'
import useSessionMiddleware from './socket/useSessionMiddleware'
import { handleSocketDisconnect } from './socket/handleSocketDisconnect'
import { handlePostChatMessage } from './socket/handleSocketChats'
import { handleChallengeAnotherUser, handleDeclineChallenge } from './socket/handleSocketChallenge'

// ========================================================

export const attachSocketIOServerToHttpServer = (httpServer: http.Server): Server => {
  const socketIOServer = new Server(httpServer, {
    cors: {
      origin: [
        "http://localhost:1337",
        "http://localhost:3000",
        "https://breaks.pirated.technology",
      ],
      credentials: true
    },
  })

  // Middleware
  useSessionMiddleware(socketIOServer)

  // Listeners
  socketIOServer.on(SOCKET_EVENTS.CONNECTION, (socket: ISocketIOSocket) => {
    // By this point we should have:
    //  sessionID = Provided by the client, originally generated
    //  userID = Loaded from sessionStore
    //  userName = Provided by the client, or loaded from sessionStore
    if (!socket.sessionID || !socket.userID || !socket.userName) {
      return;
    }
  
    // Save this user's session in the session store
    const connectedUserSession: UserSession = {
      userID: socket.userID,
      userName: socket.userName,
      connected: true,
    }
    SessionStore.saveSession(socket.sessionID, connectedUserSession)

    // Join this user to their own room (userID room)
    socket.join(socket.userID)
    
    // Tell this user what their sessionId is
    socket.emit(SOCKET_EVENTS.S2C.SESSION, {
      sessionID: socket.sessionID,
      userID: socket.userID,
      userName: socket.userName
    })
  
    // Tell everyone else that this user has connected
    socket.broadcast.emit(SOCKET_EVENTS.S2C.USER_CONNECTED, connectedUserSession)
  
    // Listen for events and handle them
    handleSocketDisconnect(socketIOServer, socket)
    handleChallengeAnotherUser(socketIOServer, socket)
    handleDeclineChallenge(socketIOServer, socket)
    handlePostChatMessage(socketIOServer, socket)
  })

  return socketIOServer
}

export { ISocketIOSocket } from './socketioServer.d'