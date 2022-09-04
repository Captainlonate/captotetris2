import { useNavigate } from 'react-router-dom'

import PlayersList from './PlayersList/PlayersList'
import { FlexBox, FilledContentWithRain } from '../../components/Common'
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
  </LobbyCardWrapper>
)

const LobbyPage = () => (
  <FilledContentWithRain>
    <LobbyCard />
  </FilledContentWithRain>
)

export default LobbyPage
