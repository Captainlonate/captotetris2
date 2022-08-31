import { useNavigate } from 'react-router-dom'

import PlayersList from './PlayersList/index'
import NetworkIndicator from '../../components/NetworkIndicator/NetworkIndicator'
import { FlexBox } from '../../components/Common'
import ChatSection from './ChatSection'
import RainBG from './RainBG'
import {
  LobbyPageWrapper,
  CenteredContentBox,
  MainArea,
  TitleText,
  SinglePlayerButton,
} from './styled'

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
      <RainBG />
    </LobbyPageWrapper>
  )
}

export default LobbyPage
