import { useEffect } from 'react'
import styled from 'styled-components'

import { SOCKET_EVENTS } from '../../network/socketio'
import { useAppContext } from '../../context/AppContext'
import { useSocketContext } from '../../context/SocketContext'

// ===================================

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

const PlayerList = styled.div`
  display: flex;
  flex-direction: column;
  overflow: auto;
  flex: 1;
  border-right: 1px solid black;
`

const PlayerListItem = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 8px;
  border-bottom: 1px solid black;
`

const PlayerListItemUsername = styled.span`
  font-weight: bold;
`

const OnlineIndicatorText = styled.span`
  margin: 0 10px 0 15px;
  font-style: italic;
`

const OnlineIndicatorIcon = styled.div`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: ${({ isOnline }) => isOnline ? '#69ca48' : 'grey'};
`

const ChallengeButton = styled.button`
  color: white;
  border: none;
  padding: 8px;
  border-radius: 5px;
  opacity: ${({ disabled }) => !!disabled ? '0.5' : '1'};
  background-color: ${({ disabled }) => !!disabled ? 'grey' : '#69ca48'};
  cursor: ${({ disabled }) => !!disabled ? 'auto' : 'pointer'};

  &:hover {
    background-color: ${({ disabled }) => !!disabled ? 'grey' : '#51bc2d'};
  }
  
  &:active {
    background-color: ${({ disabled }) => !!disabled ? 'grey' : '#319e0d'};
  }
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

// ===================================

const PlayerListing = ({ userName, isOnline, onChallenge }) => {
  const handleChallenge = (e) => {
    if (isOnline && typeof onChallenge === 'function') {
      onChallenge(e)
    }
  }

  return (
    <PlayerListItem>
      <FlexBox dir='column'>
        <PlayerListItemUsername>{userName}</PlayerListItemUsername>
        <FlexBox align='center'>
          <OnlineIndicatorText>Online</OnlineIndicatorText>
          <OnlineIndicatorIcon isOnline={isOnline} />
        </FlexBox>
      </FlexBox>
      <FlexBox flex='0 0 120px' justify='center' align='center'>
        <ChallengeButton disabled={!isOnline} onClick={handleChallenge}>
          Challenge
        </ChallengeButton>
      </FlexBox>
    </PlayerListItem>
  )
}

const ChatMessage = ({ userName, message, self }) => (
  <ChatMessageItem self={!!self}>
    <ChatUserName>{userName}: </ChatUserName>
    <ChatMessageBubble>{message}</ChatMessageBubble>
  </ChatMessageItem>
)

const LobbyPage = () => {
  const [appState, setAppState] = useAppContext()
  const socketConn = useSocketContext()

  useEffect(() => {
    // socketConn.on(SOCKET_EVENTS.USERS, (users) => {
    //   console.log("Received all users", users)
    // })
    socketConn.emit(SOCKET_EVENTS.GET_ALL_USERS)

    return () => {
      socketConn.off(SOCKET_EVENTS.USERS)
    }
  }, [])

  const onChallenge = (otherUserID) => () => {
    socketConn.emit(SOCKET_EVENTS.CHALLENGE, otherUserID)
  }

  return (
    <LobbyPageWrapper>
      <CenteredContentBox>
        <FlexBox flex='1 0'>
          <PlayerList>
            {
              appState.allUsers.filter((user) => user.userID !== appState.socketUserID).map((user, idx) => (
                <PlayerListing
                  key={user.userID}
                  userName={user.userName}
                  isOnline={user.connected}
                  onChallenge={onChallenge(user.userID)}
                />
              ))
            }
          </PlayerList>
          <MainArea>
            <TitleText>Pirate Tetris</TitleText>
            <div>
              <SinglePlayerButton>PRACTICE MODE</SinglePlayerButton>
            </div>
          </MainArea>
        </FlexBox>
        <FlexBox dir='column' justify='space-between' flex='1 0'>
          <ChatMessages>
            <ChatMessage userName='User Name One' message='Hi' />
            <ChatMessage userName='User Name Two' message='Anyone here?' />
            <ChatMessage userName='User Name Three' message='I am here.' self />
            <ChatMessage userName='User Name First and Last' message='Who wants to play?.' />
            <ChatMessage userName='User Short' message='I have a lot to type. This is a long message. It might even span multiple lines. I talk too much.' />
            <ChatMessage userName='User Name ABCD EFG HI' message='Yes, I agree.' self />
            <ChatMessage userName='Username' message='Lets fight!' />
          </ChatMessages>
          <ChatInputBox>
            <ChatInput type="text" placeholder='Send a message' />
          </ChatInputBox>
        </FlexBox>
      </CenteredContentBox>
    </LobbyPageWrapper>
  )
}

export default LobbyPage