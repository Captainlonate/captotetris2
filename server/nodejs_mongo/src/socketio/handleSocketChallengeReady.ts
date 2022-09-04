import { Server } from 'socket.io'

import RedisService from '../database/redis/RedisService'
import { stringIsLength } from '../lib/validators'
import { ISocketIOSocket } from '../socketioServer'
import { SOCKET_EVENTS } from './SocketIOEvents'

// ========================================================

export const handleSocketChallengeReady = (
  socketIOServer: Server,
  socket: ISocketIOSocket
) => {
  /**
   *  User Readies up for a match
   */
  socket.on(SOCKET_EVENTS.C2S.MATCH_PLAYER_READY, async (payload: any) => {
    if (!socket.userId || !socket.userName) {
      return
    }

    const matchID = payload?.matchID

    if (!stringIsLength(matchID, 1)) {
      console.log(
        `"${socket.userName}/${socket.userId}" tried to ready for a match with no matchID.`,
        payload
      )
      return
    }

    console.log(
      `"${socket.userName}/${socket.userId}" is ready for match "${matchID}"`
    )
  })
}
