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
  const version = process.env.REACT_APP_VERSION ?? '?'

  return (
    <StatusBarWrapper>
      <ConnectedStatus>
        Websocket: <LightIndicator online={online} />
      </ConnectedStatus>
      <div>CaptoTetris {version}</div>
      <UserNameText>{appState.user.userName}</UserNameText>
    </StatusBarWrapper>
  )
}

export default StatusBar
