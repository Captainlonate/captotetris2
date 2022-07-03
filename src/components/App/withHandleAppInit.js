import { useEffect } from 'react'

import { getSocketSession } from '../../localStorage/localStorage'
import { useAppContext } from '../../context/AppContext'
import { APP_INIT_STATUS } from '../../context/AppContext/reducer'
import { useSocketContext } from '../../context/SocketContext'
import LoginPage from '../Login/Login'
import StatusPage from '../StatusPage'

// ===================================================

export const withHandleAppInit = (WrappedComponent) => (props) => {
  const socketConn = useSocketContext()
  const [appState, setAppState] = useAppContext()

  useEffect(() => {
    // Read the web socket session info from local storage (from last session)
    // If this is a first visit, then there will not be session info yet
    const { sessionID, userID, userName } = getSocketSession()
    // And load the previous session info into the context
    const foundPreviousSession = [sessionID, userID, userName].every((val) => !!val)
    if (foundPreviousSession) {
      // Save previous session into AppContext
      setAppState({ type: 'SET_SOCKET_SESSION', payload: { sessionID, userID, userName } })
      // Attempt to connect
      setAppState({ type: 'SET_APP_INIT_STATUS', payload: APP_INIT_STATUS.ATTEMPTING_RESUME_SESSION })
      socketConn.auth = { username: userName, sessionID }
      socketConn.connect()
    } else {
      setAppState({ type: 'SET_APP_INIT_STATUS', payload: APP_INIT_STATUS.NEED_TO_LOG_IN })
    }
  }, [])

  if (appState.appInitStatus === APP_INIT_STATUS.DONE) {
    return <WrappedComponent {...props} />
  }

  if (appState.appInitStatus === APP_INIT_STATUS.NEED_TO_LOG_IN) {
    return <LoginPage />
  }

  if (appState.appInitStatus === APP_INIT_STATUS.ERROR_FIRST_CONNECT) {
    return (
      <StatusPage
        mainText='Connection Error'
        detailsText='Could not complete log in.'
        cta={<button onClick={() => setAppState({ type: 'SET_APP_INIT_STATUS', payload: APP_INIT_STATUS.NEED_TO_LOG_IN })}>Back to Log In</button>}
      />
    )
  }

  let loadingStateText = '';
  switch (appState.appInitStatus) {
    case APP_INIT_STATUS.NONE:
      loadingStateText = ''
      break;
    case APP_INIT_STATUS.ATTEMPTING_RESUME_SESSION:
      loadingStateText = 'Resuming last session'
      break;
    case APP_INIT_STATUS.ATTEMPTING_LOG_IN:
      loadingStateText = 'Signing in'
      break;
    case APP_INIT_STATUS.CONNECTED_WAITING_SERVER_SESSION:
      loadingStateText = 'Waiting for server session'
      break;
    default:
      loadingStateText = ''
  }

  return <StatusPage mainText='Loading...' detailsText={loadingStateText} />
}