import { Server } from 'socket.io'

import { makeRandomID } from '../lib/utils'
import SessionStore from '../database/SessionStore'
import { ISocketIOSocket } from '../socketioServer'
import { SOCKETIO_ERROR_CODES } from '../lib/ApiError'

// ========================================================

// Attach this to a socketIO Server
const useSessionMiddleware = (io: Server) => {
  io.use((socket: ISocketIOSocket, next) => {  
    // If the client remembers their session id (browser storage)
    const sessionID = socket.handshake.auth.sessionID
    if (sessionID) {
      // Try to load their information from the session store
      const session = SessionStore.findSession(sessionID)
      if (!session) {
        // If the session has expired (because server restarted)
        console.log('Expired session')
        return next(new Error(SOCKETIO_ERROR_CODES.EXPIRED_SESSION))
      }
      // If the session is still valid
      console.log(session.userName + "'s session is known from store.")
      socket.sessionID = sessionID
      socket.userID = session.userID
      socket.userName = session.userName
      return next()
    }
  
    const userName = socket.handshake.auth.username
    if (!userName) {
      console.log("Missing 'socket.handshake.auth.username'")
      return next(new Error("invalid 'auth.username'"))
    }
    console.log(userName + "'s auth.username was provided by client.")
  
    socket.sessionID = makeRandomID()
    socket.userID = makeRandomID()
    socket.userName = userName
    next()
  })
}

export default useSessionMiddleware
