import { Server } from 'socket.io'
import DBService from '../database/DBService'

import RedisService from '../database/redis/RedisService'
import { stringIsLength } from '../lib/validators'
import { ISocketIOSocket } from '../socketioServer'
import { SOCKET_EVENTS } from './SocketIOEvents'

// ========================================================

export const handleSocketChallengeAccept = (
  socketIOServer: Server,
  socket: ISocketIOSocket
) => {
  /**
   *  User Accepts a challenge
   */
  socket.on(SOCKET_EVENTS.C2S.CHALLENGE_ACCEPT, async (payload: any) => {
    if (!socket.userId || !socket.userName) {
      return
    }

    const matchID = payload?.matchID
    if (!stringIsLength(matchID, 1)) {
      console.log(
        `"${socket.userName}/${socket.userId}" tried to accept a challenge with no matchID.`,
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
        `SocketIO::Redis Error User tried to accept match "${matchID}" but could not fetch it.`,
        { error, matchObj }
      )
      return
    }

    // Confirm that the person who accepted the match, belongs
    // to that match id.
    if (socket.userId !== matchObj.challengeeID) {
      console.log(
        `SocketIO::Redis Error User tried to accept match "${matchID}" but isnt the challengee.`,
        { challengeeID: matchObj.challengeeID, acceptorID: socket.userId }
      )
      return
    }

    // Fetch the challenger's userName
    const { data: challengerObj, error: getChallengerErr } =
      await DBService.GetUserById(matchObj?.challengerID)

    if (!challengerObj || getChallengerErr) {
      console.log(
        `SocketIO::Redis Error User tried to accept match "${matchID}", but challenger id "${matchObj?.challengerID}" doesnt exist in DB.`,
        { challengerObj, getChallengerErr }
      )
      return
    }

    // Tell both players to get ready
    socketIOServer
      .to(matchObj?.challengerID ?? 'some_room_that_doesnt_exist')
      .to(matchObj?.challengeeID ?? 'some_room_that_doesnt_exist')
      .emit(SOCKET_EVENTS.S2C.CHALLENGE_START, {
        matchID,
        challenger: {
          userId: challengerObj.id,
          userName: challengerObj.username,
        },
        challengee: {
          userId: matchObj?.challengeeID,
          userName: socket.userName,
        },
      })
  })
}
