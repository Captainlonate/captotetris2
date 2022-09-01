import { Server } from 'socket.io'

import { ISocketIOConnectedUser, ISocketIOSocket } from '../socketioServer'
import { SOCKET_EVENTS } from './SocketIOEvents'
import { UserModel } from '../database/models'

// ========================================================

export const handleOnlineUsers = (io: Server, socket: ISocketIOSocket) => {
  socket.on(SOCKET_EVENTS.C2S.GET_ALL_USERS, async () => {
    if (!socket.userId || !socket.userName) {
      return
    }

    const allUsers = await UserModel.find({}, 'username _id', {
      limit: 0,
    })

    const allConnectedPlayerIdsSet = await io.in('player_lobby').fetchSockets()

    const playerIdsInLobby = allConnectedPlayerIdsSet.reduce(
      (obj, socketInLobby: any) => {
        obj[socketInLobby?.userId] = true
        return obj
      },
      {} as Record<string, boolean>
    )

    const transformedUsers: ISocketIOConnectedUser[] = allUsers.map((user) => ({
      userId: user._id,
      userName: user.username,
      online: !!playerIdsInLobby[user._id],
    }))

    io.emit(SOCKET_EVENTS.S2C.ALL_USERS, transformedUsers)
  })
}
