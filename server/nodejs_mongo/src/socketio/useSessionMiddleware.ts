import { Server } from 'socket.io'

import { ISocketIOSocket } from '../socketioServer'
import { SOCKETIO_ERROR_CODES } from '../lib/responseUtils'
import { checkJWTFields, ParseJWT } from '../lib/middleware/jwt'
import { stringIsLength } from '../lib/validators'

// ========================================================

// Attach this to a socketIO Server
const useSessionMiddleware = (io: Server) => {
  io.use((socket: ISocketIOSocket, next) => {
    const jwt = socket.handshake.auth?.jwt

    // The client must pass a JWT during connection
    if (!stringIsLength(jwt, 5)) {
      console.log('SocketIO Connect::Connection is missing a JWT.')
      return next(new Error(SOCKETIO_ERROR_CODES.JWT_MISSING))
    }

    // The JWT must be valid
    const { parsedJWT, isExpired, failedResponse } = ParseJWT(jwt)

    if (isExpired) {
      console.log('SocketIO Connect::The JWT is expired.')
      return next(new Error(SOCKETIO_ERROR_CODES.JWT_EXPIRED))
    }

    if (failedResponse) {
      console.log(
        'SocketIO Connect::The JWT could not be verified.',
        failedResponse
      )
      return next(new Error(SOCKETIO_ERROR_CODES.JWT_UNVERIFIABLE))
    }

    if (!checkJWTFields(parsedJWT)) {
      console.log('SocketIO Connect::JWT is missing some fields.')
      return next(new Error(SOCKETIO_ERROR_CODES.JWT_MISSING_FIELDS))
    }

    // Store the user's information on the socket object
    // which can be accessed in future handlers/middleware
    socket.userId = parsedJWT.uuid
    socket.userName = parsedJWT.username

    return next()
  })
}

export default useSessionMiddleware
