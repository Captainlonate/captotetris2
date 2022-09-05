import { useAppContext, MATCH_STATE } from '../../context/AppContext'
import TwoPlayerPage from '../../pages/TwoPlayerPage/TwoPlayerPage'

// ===================================================

export const withGameState = (WrappedComponent) => (props) => {
  const [appState] = useAppContext()

  const matchStatus = appState?.match?.status

  if (
    matchStatus === MATCH_STATE.LOADING ||
    matchStatus === MATCH_STATE.PLAYING
  ) {
    return <TwoPlayerPage />
  }

  return <WrappedComponent {...props} />
}
