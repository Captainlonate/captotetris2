import { Server } from 'socket.io'

import RedisService from '../database/redis/RedisService'
import { stringIsLength } from '../lib/validators'
import { ISocketIOSocket } from '../socketioServer'
import { SOCKET_EVENTS } from './SocketIOEvents'

// ========================================================

export const handleSocketChallengeDecline = (
  socketIOServer: Server,
  socket: ISocketIOSocket
) => {
  /**
   *  User Declines a challenge
   */
  socket.on(SOCKET_EVENTS.C2S.CHALLENGE_DECLINE, async (payload: any) => {
    if (!socket.userId || !socket.userName) {
      return
    }

    const matchID = payload?.matchID

    if (!stringIsLength(matchID, 1)) {
      console.log(
        `"${socket.userName}/${socket.userId}" tried to decline a challenge with no matchID.`,
        payload
      )
      return
    }

    const { data: matchObj, error } = await RedisService.GetChallengeByMatchID(
      matchID
    )

    if (
      !matchObj ||
      !matchObj?.challengerID ||
      !matchObj?.challengeeID ||
      error
    ) {
      console.log(
        `SocketIO::Redis Error User tried to decline match "${matchID}" but could not fetch it.`,
        { error, matchObj }
      )
      return
    } else {
      // Cleanup and prevent some bugs (somehow accepting
      // a match after it should have been declined)
      RedisService.DeleteChallengeByMatchId(matchID)
    }

    socketIOServer
      .to(matchObj?.challengerID ?? 'some_room_that_doesnt_exist')
      .to(matchObj?.challengeeID ?? 'some_room_that_doesnt_exist')
      .emit(SOCKET_EVENTS.S2C.DECLINED_CHALLENGE, { matchID })
  })
}
