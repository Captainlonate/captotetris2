import { ACTION_INTENTS, ACTION_VARIANTS } from '../utils'
import {
  ActionsContainer,
  ChallengeButton,
  AcceptButton,
  DeclineButton,
  PendingButton,
} from './styled'

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

const ListItemActions = ({ actionVariant, onTakeAction, userId, matchID }) => {
  switch (actionVariant) {
    case ACTION_VARIANTS.CAN_CHALLENGE:
      return (
        <ActionCanChallenge
          onChallenge={onTakeAction(ACTION_INTENTS.CHALLENGE, {
            otherUserId: userId,
          })}
        />
      )
    case ACTION_VARIANTS.PENDING:
      return <ActionPendingChallenge />
    case ACTION_VARIANTS.DECIDING:
      return (
        <ActionDecidingIfAcceptOrDecline
          onAccept={onTakeAction(ACTION_INTENTS.ACCEPT_CHALLENGE, {
            otherUserId: userId,
            matchID,
          })}
          onDecline={onTakeAction(ACTION_INTENTS.DECLINE_CHALLENGE, {
            otherUserId: userId,
            matchID,
          })}
        />
      )
    default:
      return null
  }
}

export default ListItemActions
