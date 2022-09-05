import { useState } from 'react'
import styled, { keyframes } from 'styled-components'

import { useAppContext } from '../../../context/AppContext'
import { useSocketContext } from '../../../context/SocketContext'
import { SOCKET_EVENTS } from '../../../network/socketio'

import { AbsoluteFill, DFlexCenter } from '../../Common'

// ===============Styled Components==============

const Wrapper = styled.div`
  ${AbsoluteFill}
  ${DFlexCenter}
  background-color: rgba(0, 0, 0, 0.6);
`

const Card = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 90%;
  height: 75%;
  padding: 2em;
  box-sizing: border-box;
  border-radius: 10px;
  font-size: 16px;
  background-color: #7fbcd2;
  color: white;
`

const slideToLeftAnimation = keyframes`
  100% { left: 0; }
`

const slideToRightAnimation = keyframes`
  100% { left: 0; }
`

const Word = styled.div`
  position: relative;

  text-align: ${({ textAlign }) => textAlign ?? 'center'};
  font-style: ${({ vs }) => (vs ? 'italic' : 'normal')};
  font-size: ${({ vs }) => (vs ? '.75em' : '1.25em')};
  color: ${({ vs }) => (vs ? '#d27f7f' : '#ffeeaf')};
  transform: rotate(-10deg);
  animation-delay: 0.5s;

  &.slideToRight {
    left: -1000px;
    animation: ${slideToRightAnimation} 1s forwards;
  }

  &.slideToLeft {
    left: 1000px;
    animation: ${slideToLeftAnimation} 1s forwards;
  }
`

const Title = styled.h2`
  margin: 0;
  text-align: center;
  font-size: 3em;
  width: 100%;
`

const LoadingStatus = styled.div`
  font-style: italic;
  padding: 2em 0 1em;
  text-align: center;
  font-size: 2em;
  color: #ffeeaf;
`

const Actions = styled.div`
  display: flex;
  justify-content: center;
`

const Button = styled.div`
  border: none;
  border-radius: 5px;
  cursor: pointer;
  padding: 0.5em 1em;
  margin: 0 0.75em;
  font-size: 2.25em;
`

const PrimaryButton = styled(Button)`
  background-color: #ffeeaf;
  color: #7fbcd2;
`

const CancelButton = styled(Button)`
  background-color: transparent;
  color: #ffeeaf;
  border: 3px solid #ffeeaf;
`

// ==============================================

const GameConfirmationModal = () => {
  const [appState, setAppState] = useAppContext()
  const socketConn = useSocketContext()
  const [ready, setReady] = useState(false)
  const [statusText, setStatusText] = useState('Ready to start?')

  const yourName = appState.user.userName
  const opponentName = appState.match.opponentName

  const onClickReady = () => {
    setReady(true)
    setStatusText('Waiting for opponent...')
    socketConn.emit(SOCKET_EVENTS.C2S.MATCH_PLAYER_READY, {
      matchID: appState?.match?.matchID,
    })
  }

  const onClickCancel = () => {
    setStatusText('Cancelling...')
    socketConn.emit(SOCKET_EVENTS.C2S.MATCH_CANCELLED, {
      matchID: appState?.match?.matchID,
    })
    //
    // TODO: update local state that match was cancelled.
    //
  }

  return (
    <Wrapper>
      <Card>
        <Title>
          <Word className="slideToRight" textAlign="left">
            {yourName}
          </Word>
          <Word textAlign="center" vs>
            vs
          </Word>
          <Word className="slideToLeft" textAlign="right">
            {opponentName}
          </Word>
        </Title>
        <LoadingStatus>{statusText}</LoadingStatus>
        <Actions>
          {!ready && (
            <PrimaryButton onClick={onClickReady}>Ready</PrimaryButton>
          )}
          <CancelButton onClick={onClickCancel}>Cancel</CancelButton>
        </Actions>
      </Card>
    </Wrapper>
  )
}

export default GameConfirmationModal
