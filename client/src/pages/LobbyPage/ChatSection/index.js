import { useCallback, useRef, useEffect, useState } from 'react'

import { useAppContext } from '../../../context/AppContext'
import { useSocketContext } from '../../../context/SocketContext'
import { SOCKET_EVENTS } from '../../../network/socketio'
import { FlexBox } from '../../../components/Common'
import { fetchInitialChatsAsync } from '../../../context/AppContext/actions'
import {
  ChatMessages,
  ChatMessageItem,
  ChatUserName,
  ChatMessageBubble,
  ChatInputBox,
  ChatInput,
  ChatMessageBubbleMessage,
  ChatMessageBubbleTime,
} from './styled'

const ChatMessage = ({ userName, message, self, time }) => (
  <ChatMessageItem title={time} self={!!self}>
    <ChatUserName>{self ? 'Me' : userName}</ChatUserName>
    <ChatMessageBubble>
      <ChatMessageBubbleMessage>{message}</ChatMessageBubbleMessage>
      <ChatMessageBubbleTime>{time}</ChatMessageBubbleTime>
    </ChatMessageBubble>
  </ChatMessageItem>
)

const Chat = () => {
  const [appState, setAppState] = useAppContext()
  const socketConn = useSocketContext()
  const [chatMessage, setChatMessage] = useState('')
  const bottomDivRef = useRef()

  const {
    hasFetchedInitialChats,
    user: { jwt },
  } = appState

  useEffect(() => {
    if (!hasFetchedInitialChats) {
      fetchInitialChatsAsync(setAppState, jwt)
    }
  }, [setAppState, hasFetchedInitialChats, jwt])

  useEffect(() => {
    // Whenever the number of messages changes, scroll to the bottom
    if (appState?.chatMessages.length > 0) {
      setImmediate(() => {
        bottomDivRef.current.scrollIntoView({ behavior: 'smooth' })
      })
    }
  }, [appState?.chatMessages.length])

  const onPostNewChatMessage = useCallback(
    (e) => {
      if (e.key === 'Enter' && chatMessage.trim().length > 0) {
        socketConn.emit(SOCKET_EVENTS.C2S.POST_CHAT_MESSAGE, chatMessage)
        setChatMessage('')
      }
    },
    [chatMessage, socketConn]
  )

  return (
    <FlexBox dir="column" justify="space-between" flex="1 0">
      <ChatMessages>
        {appState?.chatMessages.map(({ id, author, message, createdAt }) => (
          <ChatMessage
            key={id}
            userName={author}
            message={message}
            time={createdAt}
            self={appState.user.userName === author}
          />
        ))}
        {/* This div is used for scrolling to the bottom */}
        <div ref={bottomDivRef}></div>
      </ChatMessages>
      <ChatInputBox>
        <ChatInput
          type="text"
          placeholder="Send a message"
          value={chatMessage}
          onChange={(e) => setChatMessage(e.target.value)}
          onKeyDown={onPostNewChatMessage}
        />
      </ChatInputBox>
    </FlexBox>
  )
}

export default Chat
