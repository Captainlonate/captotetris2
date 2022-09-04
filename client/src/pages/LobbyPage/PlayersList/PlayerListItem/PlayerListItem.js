import { FlexBox } from '../../../../components/Common'
import ListItemActions from './ListItemActions'
import {
  StyledPlayerListItem,
  PlayerListItemUsername,
  OnlineIndicatorText,
  OnlineIndicatorIcon,
} from './styled'

// =====================================================

const PlayerListItem = ({
  userId,
  userName,
  isOnline,
  actionVariant,
  onTakeAction,
  matchID,
}) => (
  <StyledPlayerListItem>
    <FlexBox dir="column">
      <PlayerListItemUsername>{userName}</PlayerListItemUsername>
      <FlexBox align="center">
        <OnlineIndicatorText>Online</OnlineIndicatorText>
        <OnlineIndicatorIcon isOnline={isOnline} />
      </FlexBox>
    </FlexBox>
    <FlexBox flex="0 0 120px" justify="center" align="center">
      <ListItemActions
        actionVariant={actionVariant}
        onTakeAction={onTakeAction}
        userId={userId}
        matchID={matchID}
      />
    </FlexBox>
  </StyledPlayerListItem>
)

export default PlayerListItem
