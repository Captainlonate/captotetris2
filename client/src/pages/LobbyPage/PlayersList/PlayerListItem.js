import styled from 'styled-components'

import { ACTION_INTENTS, ACTION_VARIANTS } from './index'

// =================Styled Components====================

const FlexBox = styled.div`
  display: flex;
  flex: ${({ flex }) => flex ?? '1'};
  flex-direction: ${({ dir }) => dir ?? 'row'};
  justify-content: ${({ justify }) => justify ?? 'stretch'};
  align-items: ${({ align }) => align ?? 'normal'};
  overflow: hidden;
`

const StyledPlayerListItem = styled.div`
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
  background-color: ${({ isOnline }) => (isOnline ? '#69ca48' : 'grey')};
`

const ActionsContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
`

const ButtonBase = styled.button`
  color: white;
  border: none;
  padding: 8px;
  border-radius: 5px;
  cursor: ${({ disabled }) => (!!disabled ? 'auto' : 'pointer')};
`

const ChallengeButton = styled(ButtonBase)`
  color: black;
  background-color: ${({ disabled }) => (!!disabled ? 'grey' : '#fff33d')};
  &:hover {
    background-color: ${({ disabled }) => (!!disabled ? 'grey' : '#f2e626')};
  }
  &:active {
    background-color: ${({ disabled }) => (!!disabled ? 'grey' : '#eea503')};
  }
`

const AcceptButton = styled(ButtonBase)`
  background-color: ${({ disabled }) => (!!disabled ? 'grey' : 'darkgreen')};
  &:hover {
    background-color: ${({ disabled }) => (!!disabled ? 'grey' : '#51bc2d')};
  }
  &:active {
    background-color: ${({ disabled }) => (!!disabled ? 'grey' : '#319e0d')};
  }
`

const DeclineButton = styled(ButtonBase)`
  background-color: ${({ disabled }) => (!!disabled ? 'grey' : 'red')};
  &:hover {
    background-color: ${({ disabled }) => (!!disabled ? 'grey' : '#51bc2d')};
  }
  &:active {
    background-color: ${({ disabled }) => (!!disabled ? 'grey' : '#319e0d')};
  }
`

const PendingButton = styled(ButtonBase).attrs({
  disabled: true,
})`
  background-color: blue;
  cursor: auto;
`

// ===================Component Parts===================

const ActionCanChallenge = ({ onChallenge, text }) => (
  <ActionsContainer>
    <ChallengeButton onClick={onChallenge}>{text}</ChallengeButton>
  </ActionsContainer>
)

ActionCanChallenge.defaultProps = {
  text: 'Challenge',
}

const ActionPendingChallenge = ({ text }) => (
  <ActionsContainer>
    <PendingButton>{text}</PendingButton>
  </ActionsContainer>
)

ActionPendingChallenge.defaultProps = {
  text: 'Challenge Sent',
}

const ActionDecidingIfAcceptOrDecline = ({
  onAccept,
  onDecline,
  acceptText,
  declineText,
}) => (
  <ActionsContainer>
    <AcceptButton onClick={onAccept}>{acceptText}</AcceptButton>
    <DeclineButton onClick={onDecline}>{declineText}</DeclineButton>
  </ActionsContainer>
)

ActionDecidingIfAcceptOrDecline.defaultProps = {
  acceptText: 'Accept',
  declineText: 'Decline',
}

// =====================================================

const PlayerListItem = ({
  userID,
  userName,
  isOnline,
  actionVariant,
  onTakeAction,
}) => {
  let actions = null
  if (actionVariant === ACTION_VARIANTS.CAN_CHALLENGE) {
    actions = (
      <ActionCanChallenge
        onChallenge={onTakeAction(ACTION_INTENTS.CHALLENGE, userID)}
      />
    )
  } else if (actionVariant === ACTION_VARIANTS.PENDING) {
    actions = <ActionPendingChallenge />
  } else if (actionVariant === ACTION_VARIANTS.DECIDING) {
    actions = (
      <ActionDecidingIfAcceptOrDecline
        onAccept={onTakeAction(ACTION_INTENTS.ACCEPT_CHALLENGE, userID)}
        onDecline={onTakeAction(ACTION_INTENTS.DECLINE_CHALLENGE, userID)}
      />
    )
  }

  return (
    <StyledPlayerListItem>
      <FlexBox dir="column">
        <PlayerListItemUsername>{userName}</PlayerListItemUsername>
        <FlexBox align="center">
          <OnlineIndicatorText>Online</OnlineIndicatorText>
          <OnlineIndicatorIcon isOnline={isOnline} />
        </FlexBox>
      </FlexBox>
      <FlexBox flex="0 0 120px" justify="center" align="center">
        {actions}
      </FlexBox>
    </StyledPlayerListItem>
  )
}

export default PlayerListItem
