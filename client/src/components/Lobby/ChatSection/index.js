import { useCallback, useRef, useEffect, useState } from 'react'
// import styled from 'styled-components'

import { useAppContext } from '../../../context/AppContext'
import { normalizeChatMessageFromApiForCtx } from '../../../context/AppContext/utils'
import { useSocketContext } from '../../../context/SocketContext'
import { API } from '../../../network/Api'
import { SOCKET_EVENTS } from '../../../network/socketio'
import { FlexBox } from '../../Common'
import {
  ChatMessages,
  ChatMessageItem,
  ChatUserName,
  ChatMessageBubble,
  ChatInputBox,
  ChatInput,
} from './styled'

// const ChatMessages = styled.div`
//   flex: 1;
//   border-top: 1px solid black;
//   border-bottom: 1px solid black;
//   display: flex;
//   flex-direction: column;
//   overflow: auto;
//   padding: 20px 20px 20px 0;
// `

// const ChatMessageItem = styled.div`
//   flex: 1;
//   display: flex;
//   padding: 10px;
//   align-items: center;
// `

// const ChatUserName = styled.div`
//   font-weight: bold;
//   flex: 0 0 auto;
// `

// const ChatMessageBubble = styled.div`
//   flex: 1;
//   border-radius: 10px;
//   padding: 5px 10px;
//   margin-left: 10px;
//   background-color: #fff8e7;
//   font-size: 0.9em;
// `

// const ChatInputBox = styled.div`
//   height: 50px;
//   display: flex;
//   align-items: center;
//   padding: 10px;
// `

// const ChatInput = styled.input`
//   font-size: 18px;
//   padding: 6px;
//   border-radius: 5px;
//   border: 0;
//   flex: 1;
//   display: block;
// `

const ChatMessage = ({ userName, message, self }) => (
  <ChatMessageItem self={!!self}>
    <ChatUserName>{userName}: </ChatUserName>
    <ChatMessageBubble>{message}</ChatMessageBubble>
  </ChatMessageItem>
)

const Chat = () => {
  const [appState, setAppState] = useAppContext()
  const socketConn = useSocketContext()
  const [chatMessage, setChatMessage] = useState('')
  const bottomDivRef = useRef()

  useEffect(() => {
    // Fetch the initial list of chat messages
    API.GetRecentChats(appState.user.jwt).then((apiResponse) => {
      if (apiResponse.isError) {
        console.error('Error fetching recent chats')
      } else {
        setAppState({
          type: 'SET_ALL_CHATS',
          payload: apiResponse.data
            ?.map(normalizeChatMessageFromApiForCtx)
            .reverse()
        })
        if (bottomDivRef.current) {
          bottomDivRef.current.scrollIntoView({ behavior: "smooth" })
        }
      }
    })
  }, [setAppState])

  useEffect(() => {
    // Whenever the number of messages changes, scroll to the bottom
    if (appState?.chatMessages.length > 0) {
      setImmediate(() => {
        bottomDivRef.current.scrollIntoView({ behavior: "smooth" })
      })
    }
  }, [appState?.chatMessages.length])

  const onPostNewChatMessage = useCallback((e) => {
    if (e.key === 'Enter' && chatMessage.trim().length > 0) {
      socketConn.emit(SOCKET_EVENTS.C2S.POST_CHAT_MESSAGE, chatMessage)
      setChatMessage('')
    }
  }, [chatMessage, socketConn])

  return (
    <FlexBox dir='column' justify='space-between' flex='1 0'>
      <ChatMessages>
        {
          appState?.chatMessages.map(({ id, author, message }) => (
            <ChatMessage key={id} userName={author} message={message} />
          ))
        }
        {/* This div is used for scrolling to the bottom */}
        <div ref={bottomDivRef}></div>
      </ChatMessages>
      <ChatInputBox>
        <ChatInput
          type="text"
          placeholder='Send a message'
          value={chatMessage}
          onChange={(e) => setChatMessage(e.target.value)}
          onKeyDown={onPostNewChatMessage}
        />
      </ChatInputBox>
    </FlexBox>
  )
}

export default Chat