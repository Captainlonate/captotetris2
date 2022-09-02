import { useNavigate } from 'react-router-dom'

import PlayersList from './PlayersList/index'
import { FlexBox } from '../../components/Common'
import ChatSection from './ChatSection'
import FilledContentWithRain from '../../components/Common/Layout/FilledContentWithRain'
import {
  LobbyCardWrapper,
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

const LobbyCard = () => (
  <LobbyCardWrapper>
    <FlexBox flex="1 0">
      <PlayersList />
      <MainArea>
        <TitleText>CaptoTetris</TitleText>
        <div>
          <PracticeModeButton />
        </div>
      </MainArea>
    </FlexBox>
    <ChatSection />
  </LobbyCardWrapper>
)

const LobbyPage = () => (
  <FilledContentWithRain>
    <LobbyCard />
  </FilledContentWithRain>
)

export default LobbyPage
