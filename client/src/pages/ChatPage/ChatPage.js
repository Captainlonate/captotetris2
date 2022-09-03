import { useCallback, useEffect } from 'react'

import { SOCKET_EVENTS } from '../../network/socketio'
import { useSocketContext } from '../../context/SocketContext'
import {
  ACTION_TYPE,
  useAppContext,
  fetchInitialChatsAsync,
} from '../../context/AppContext'

import ChatMessages from './ChatMessages/ChatMessages'
import ChatInputAndButton from './ChatInputAndButton/ChatInputAndButton'
import {
  FlexBox,
  FloatingCard,
  FilledContentWithRain,
} from '../../components/Common'

// ==============================================

/**
 *
 */
const ChatPageContents = () => {
  const [appState, setAppState] = useAppContext()
  const socketConn = useSocketContext()

  const {
    notifications: { haveUnreadChats },
    chatMessages,
    hasFetchedInitialChats,
    user: { jwt, userName },
  } = appState

  /**
   * useEffect - Fetch initial chat messages
   */
  useEffect(() => {
    if (!hasFetchedInitialChats) {
      fetchInitialChatsAsync(setAppState, jwt)
    }
  }, [setAppState, hasFetchedInitialChats, jwt])

  const onPostNewChatMessage = useCallback(
    (chatMessage) => {
      socketConn.emit(SOCKET_EVENTS.C2S.POST_CHAT_MESSAGE, chatMessage)
    },
    [socketConn]
  )

  const markMessagesAsRead = useCallback(() => {
    if (haveUnreadChats) {
      setAppState({ type: ACTION_TYPE.SET_HAS_UNREAD_CHATS, payload: false })
    }
  }, [haveUnreadChats, setAppState])

  return (
    <FloatingCard>
      <FlexBox dir="column" justify="space-between" flex="1 0">
        <ChatMessages
          messages={chatMessages}
          loggedInUserName={userName}
          markMessagesAsRead={markMessagesAsRead}
        />
        <ChatInputAndButton onSubmit={onPostNewChatMessage} />
      </FlexBox>
    </FloatingCard>
  )
}

/**
 *
 */
const ChatPage = () => (
  <FilledContentWithRain>
    <ChatPageContents />
  </FilledContentWithRain>
)

export default ChatPage
