import { useAppContext } from '../../../../../context/AppContext'
import {
  ConnectedStatus,
  StatusBarWrapper,
  LightIndicator,
  UserNameText,
} from './styled'

const StatusBar = () => {
  const [appState] = useAppContext()
  const online = appState?.socketIsCurrentlyConnected

  return (
    <StatusBarWrapper>
      <ConnectedStatus>
        Websocket: <LightIndicator online={online} />
      </ConnectedStatus>
      <UserNameText>{appState.user.userName}</UserNameText>
    </StatusBarWrapper>
  )
}

export default StatusBar
