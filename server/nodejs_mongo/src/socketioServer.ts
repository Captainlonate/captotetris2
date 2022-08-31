/*
  Socket.IO Server
*/
import http from 'http'
import { Server, Socket } from 'socket.io'
import { checkJWTFields, ParseJWT } from './lib/middleware/jwt'
import { stringIsLength } from './lib/validators'

import { SOCKET_EVENTS } from './socketio/SocketIOEvents'
import { handleSocketDisconnect } from './socketio/handleSocketDisconnect'
import { handlePostChatMessage } from './socketio/handleSocketChats'
import useSessionMiddleware from './socketio/useSessionMiddleware'

// ==============================================

export interface ISocketIOSocket extends Socket {
  userId?: string
  userName?: string
}

// ==============================================

export const attachSocketIOServerToHttpServer = (
  httpServer: http.Server
): Server => {
  const socketIOServer = new Server(httpServer, {
    cors: {
      origin: [
        'http://localhost:1337',
        'http://localhost:3000',
        'https://breaks.pirated.technology',
      ],
      credentials: true,
    },
  })

  // Middleware
  useSessionMiddleware(socketIOServer)

  // Listeners
  socketIOServer.on(SOCKET_EVENTS.CONNECTION, (socket: ISocketIOSocket) => {
    // Middleware that can run on each event
    // socket.use((packet, next) => {
    //   const [eventName, clientPayload] = packet
    //   console.log({ eventName, clientPayload })
    //   next()
    // })
    const userId = socket.userId
    const userName = socket.userName

    if (!userId || !userName) {
      console.log('socket.on("connection") still missing userId or userName')
      return
    }

    const connectedUserSession = {
      userId,
      userName,
      connected: true,
    }

    // Save this session

    // Join this user to their own room (userID room)
    socket.join(userId)

    // Tell everyone else that this user has connected
    socket.broadcast.emit(
      SOCKET_EVENTS.S2C.USER_CONNECTED,
      connectedUserSession
    )

    console.log(`SocketIO::${userName}/${userId} has connected.`)

    // Listen for events and handle them
    handleSocketDisconnect(socketIOServer, socket)
    handlePostChatMessage(socketIOServer, socket)
  })

  return socketIOServer
}
