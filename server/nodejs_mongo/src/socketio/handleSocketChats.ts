import { Server } from 'socket.io'

import { ISocketIOSocket } from '../socketioServer'
import { SOCKET_EVENTS } from './SocketIOEvents'
import DBService, { normalizeChatMessageForApi } from '../database/DBService'

// ========================================================

export const handlePostChatMessage = (
  socketIOServer: Server,
  socket: ISocketIOSocket
) => {
  socket.on(SOCKET_EVENTS.C2S.POST_CHAT_MESSAGE, async (chatMessage: any) => {
    if (!socket.userId || !socket.userName) {
      return
    }

    if (typeof chatMessage !== 'string') {
      console.log(
        `"${socket.userName}/${socket.userId}" tried to post an empty chat message.`,
        chatMessage
      )
      return
    }

    const { data, error } = await DBService.CreateChat(
      socket.userName,
      chatMessage
    )

    if (error || !data) {
      console.log(
        `SocketIO Error when saving new chat message from "${socket.userName}/${socket.userId}"`,
        error
      )
      return
    }

    const newChatMessage = normalizeChatMessageForApi(data)

    socketIOServer.emit(SOCKET_EVENTS.S2C.NEW_CHAT_MESSAGE, newChatMessage)
  })
}
