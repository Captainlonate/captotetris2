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

    const { data: matchObj, error } = await RedisService.GetChallengeByMatchID(
      matchID
    )
    if (
      error ||
      !matchObj ||
      !matchObj?.challengerID ||
      !matchObj?.challengeeID
    ) {
      console.log(
        `SocketIO::Redis Error User tried to ready for match "${matchID}" but could not fetch it.`,
        { error, matchObj }
      )
      return
    }

    const errorPlayerReady = await RedisService.SetPlayerReady(
      matchID,
      socket.userId
    )
    if (errorPlayerReady) {
      console.log(
        `SocketIO::Redis Error Setting player ${socket.userId} ready for "${matchID}"`,
        errorPlayerReady
      )
      return
    }

    // Each player joins the matchID room when they ready up
    socket.join(matchID)

    // Was the opponent already ready?
    const opponentID =
      socket.userId === matchObj?.challengerID
        ? matchObj?.challengeeID
        : matchObj?.challengerID

    const isOpponentReady = matchObj[`ready:${opponentID}`] === 'true'
    if (isOpponentReady) {
      // Set matchBegan
      await RedisService.SetMatchBegan(matchID)

      console.log('Both players are ready.')

      // Emit to both
      socketIOServer
        .to(matchObj?.challengerID ?? 'some_room_that_doesnt_exist')
        .to(matchObj?.challengeeID ?? 'some_room_that_doesnt_exist')
        .emit(SOCKET_EVENTS.S2C.MATCH_STARTED, { matchID })
    }
  })
}
