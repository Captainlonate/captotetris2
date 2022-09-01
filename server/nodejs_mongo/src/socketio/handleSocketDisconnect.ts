import { Server } from 'socket.io'

import { ISocketIOSocket } from '../socketioServer'
import { SOCKET_EVENTS } from './SocketIOEvents'
// import SessionStore, { UserSession } from '../database/SessionStore'
// import ChallengeStore from '../database/ChallengeStore'

// ========================================================

export const handleSocketDisconnect = (
  socketIOServer: Server,
  socket: ISocketIOSocket
) => {
  socket.on(SOCKET_EVENTS.DISCONNECT, async () => {
    if (!socket.userId || !socket.userName) {
      return
    }

    // Confirm that this socket is not in any other room, anywhere
    const matchingSockets = await socketIOServer.in(socket.userId).allSockets()
    const isDisconnectedFromEverywhere = matchingSockets.size === 0
    if (isDisconnectedFromEverywhere) {
      // Notify other users that this user has disconnected
      socket.broadcast.emit(SOCKET_EVENTS.S2C.USER_DISCONNECTED, socket.userId)
      // Remove all incoming/outgoing challenges involving this user
      // ChallengeStore.clearUser(socket.userID)
      // Update the session store that this user has disconnected
      // const disconnectedUserSession: UserSession = {
      //   userID: socket.userID,
      //   userName: socket.userName,
      //   connected: false,
      // }
      // SessionStore.saveSession(socket.sessionID, disconnectedUserSession)
    }
  })
}
