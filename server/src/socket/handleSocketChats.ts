import { Server } from 'socket.io'

import { ISocketIOSocket } from '../socketioServer'
import { SOCKET_EVENTS } from '../lib/SocketIOEvents'
import SessionStore, { UserSession } from '../database/SessionStore'
import ChatsStore, { ChatMessage } from '../database/ChatsStore'

// ========================================================

export const handlePostChatMessage = (socketIOServer: Server, socket: ISocketIOSocket) => {
  socket.on(SOCKET_EVENTS.C2S.POST_CHAT_MESSAGE, async (chatMessage) => {
    if (!socket.userID || !socket.sessionID || !socket.userName) {
      return;
    }

    const newChatMessage = new ChatMessage({
      authorName: socket.userName,
      authorUserID: socket.userID,
      message: chatMessage
    })

    ChatsStore.addChat(newChatMessage)

    socketIOServer.emit(SOCKET_EVENTS.S2C.NEW_CHAT_MESSAGE, newChatMessage)
  })
}