import { Server } from 'socket.io'

import RedisService from '../database/redis/RedisService'
import { makeRandomID } from '../lib/utils'
import { stringIsLength } from '../lib/validators'
import { ISocketIOSocket } from '../socketioServer'
import { SOCKET_EVENTS } from './SocketIOEvents'

// ========================================================

export const handleSocketChallengeIssue = (
  socketIOServer: Server,
  socket: ISocketIOSocket
) => {
  /**
   * User challenges another to a match
   */
  socket.on(SOCKET_EVENTS.C2S.CHALLENGE_TO, async (payload: any) => {
    if (!socket.userId || !socket.userName) {
      return
    }

    const challengeeID = payload?.challengee

    if (!stringIsLength(challengeeID, 1)) {
      console.log(
        `"${socket.userName}/${socket.userId}" tried to challenge a user with a bad payload.`,
        payload
      )
      return
    }

    const matchID = makeRandomID(10)

    const createChallengeError = await RedisService.CreateChallenge(
      matchID,
      socket.userId,
      challengeeID
    )

    if (createChallengeError) {
      console.log(
        `SocketIO::Redis Error when challenging another user "${socket.userName}/${socket.userId}"`,
        createChallengeError
      )
      return
    }

    // Tell the challenger that they've successfully challenged another person
    socket.emit(SOCKET_EVENTS.S2C.YOU_CHALLENGED_ANOTHER, {
      matchID,
      challengeeID,
    })

    // Tell the challengee that they've been challenged
    socketIOServer
      .to(challengeeID)
      .emit(SOCKET_EVENTS.S2C.SOMEONE_CHALLENGED_YOU, {
        matchID,
        challengerID: socket.userId,
      })
  })
}
