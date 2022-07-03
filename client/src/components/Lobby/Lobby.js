import { useCallback, useRef, useEffect, useState } from 'react'
import styled from 'styled-components'
import { useNavigate } from 'react-router-dom'

import { useAppContext } from '../../context/AppContext'
import { useSocketContext } from '../../context/SocketContext'
import { API } from '../../network/Api'
import { SOCKET_EVENTS } from '../../network/socketio'
import PlayersList from './PlayersList/index'

// =================Styled Components====================

const LobbyPageWrapper = styled.div`
  position: absolute;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  background-color: lightblue;

  & * {
    box-sizing: border-box;
  }
`

const CenteredContentBox = styled.div`
  width: 75vw;
  height: 78vh;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  background-color: #ead6a7;
  box-shadow: 2px 2px 9px #111111;
  max-width: 900px;
`

const FlexBox = styled.div`
  display: flex;
  flex: ${({ flex }) => flex ?? '1'};
  flex-direction: ${({ dir }) => dir ?? 'row'};
  justify-content: ${({ justify }) => justify ?? 'stretch'};
  align-items: ${({ align }) => align ?? 'normal'};
  overflow: hidden;
`

const ChatMessages = styled.div`
  flex: 1;
  border-top: 1px solid black;
  border-bottom: 1px solid black;
  display: flex;
  flex-direction: column;
  overflow: auto;
  padding: 20px 20px 20px 0;
`

const ChatMessageItem = styled.div`
  flex: 1;
  display: flex;
  padding: 10px;
  align-items: center;
`

const ChatUserName = styled.div`
  font-weight: bold;
  flex: 0 0 auto;
`

const ChatMessageBubble = styled.div`
  flex: 1;
  border-radius: 10px;
  padding: 5px 10px;
  margin-left: 10px;
  background-color: #fff8e7;
  font-size: 0.9em;
`

const ChatInputBox = styled.div`
  height: 50px;
  display: flex;
  align-items: center;
  padding: 10px;
`

const ChatInput = styled.input`
  font-size: 18px;
  padding: 6px;
  border-radius: 5px;
  border: 0;
  flex: 1;
  display: block;
`

const MainArea = styled.div`
  display: flex;
  flex-direction: column;
  overflow: auto;
  flex: 1;
  padding: 12px;
`

const TitleText = styled.h1`
  font-size: 42px;
  text-align: center;
  margin-top: 0;
  color: #489aca;
`

const SinglePlayerButton = styled.button`
  padding: 12px;
  border: none;
  border-radius: 5px;
  width: 100%;
  background-color: #a556ff;
  color: white;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
  letter-spacing: 1px;

  &:hover {
    background-color: #8b3ee2;
  }

  &:active {
    background-color: #6923b7;
  }
`

// ===================Component Parts===================

const ChatMessage = ({ userName, message, self }) => (
  <ChatMessageItem self={!!self}>
    <ChatUserName>{userName}: </ChatUserName>
    <ChatMessageBubble>{message}</ChatMessageBubble>
  </ChatMessageItem>
)

const PracticeModeButton = () => {
  let navigate = useNavigate();

  const onClick = (e) => {
    e.preventDefault()
    navigate('/play/alone')
  }

  return (
    <SinglePlayerButton onClick={onClick}>PRACTICE MODE</SinglePlayerButton>
  )
}

// =====================================================

const LobbyPage = () => {
  const [appState, setAppState] = useAppContext()
  const socketConn = useSocketContext()
  const [chatMessage, setChatMessage] = useState('')
  const bottomDivRef = useRef()

  useEffect(() => {
    // Fetch the initial list of players
    API.GetAllUsers().then((apiResponse) => {
      if (apiResponse.isError) {
        console.error('Error fetching all users')
      } else {
        setAppState({ type: 'SET_ALL_USERS', payload: apiResponse.data })
      }
    })
    // Fetch the initial list of chat messages
    API.GetRecentChats().then((apiResponse) => {
      if (apiResponse.isError) {
        console.error('Error fetching recent chats')
      } else {
        setAppState({ type: 'SET_ALL_CHATS', payload: apiResponse.data })
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
    if (e.key === 'Enter') {
      socketConn.emit(SOCKET_EVENTS.C2S.POST_CHAT_MESSAGE, chatMessage)
      setChatMessage('')
    }
  }, [chatMessage, socketConn])

  return (
    <LobbyPageWrapper>
      <CenteredContentBox>
        <FlexBox flex='1 0'>
          <PlayersList />
          <MainArea>
            <TitleText>Pirate Tetris</TitleText>
            <div>
              <PracticeModeButton />
            </div>
          </MainArea>
        </FlexBox>
        <FlexBox dir='column' justify='space-between' flex='1 0'>
          <ChatMessages>
            {
              appState?.chatMessages.map(({ id, authorName, message }) => (
                <ChatMessage key={id} userName={authorName} message={message} />
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
      </CenteredContentBox>
    </LobbyPageWrapper>
  )
}

export default LobbyPage