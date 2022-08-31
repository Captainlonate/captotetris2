import styled from 'styled-components'
import { useNavigate } from 'react-router-dom'

import PlayersList from './PlayersList/index'
import NetworkIndicator from '../NetworkIndicator/NetworkIndicator'
import { FlexBox } from '../Common'
import ChatSection from './ChatSection'

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

const PracticeModeButton = () => {
  let navigate = useNavigate()

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
  return (
    <LobbyPageWrapper>
      <CenteredContentBox>
        <FlexBox flex="1 0">
          <PlayersList />
          <MainArea>
            <TitleText>Pirate Tetris</TitleText>
            <div>
              <PracticeModeButton />
            </div>
          </MainArea>
        </FlexBox>
        <ChatSection />
      </CenteredContentBox>
      <NetworkIndicator />
    </LobbyPageWrapper>
  )
}

export default LobbyPage
