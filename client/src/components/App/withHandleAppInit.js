import { useEffect, useCallback } from 'react'
import { toast } from 'react-toastify'

import { useAppContext } from '../../context/AppContext'
import { APP_INIT_STATUS, ACTION_TYPE } from '../../context/AppContext/reducer'
import { useSocketContext } from '../../context/SocketContext'
import LoginPage from '../../pages/LoginPage/LoginPage'
import StatusPage from '../StatusPage'
import * as localStore from '../../localStorage/localStorage'
import { API } from '../../network/Api'
import Logger from '../../utils/Logger'
import { API_ERRORCODES } from '../../network/Api/ApiError'

// ===================================================

const attemptToResumeSession = async (
  previousSessionJWT,
  setAppState,
  socketConn
) => {
  // 1) Refresh a new JWT with the old one
  //    1.a) If you get an error, clear local storage, then
  //        set status to STATUS_NEEDS_MANUAL_LOGIN
  //    1.b) If you get a new JWT, set it in local storage

  // 2) Call /me with the new JWT
  const meResponse = await API.Me(previousSessionJWT)
  if (meResponse.isError) {
    if (meResponse.errorCode === API_ERRORCODES.expired_jwt) {
      toast('Session Expired. Re-login')
    }

    Logger.debug(
      `Could not resume session, /me failed. Redirecting to login: "${meResponse.errorMessage}"`
    )

    localStore.clearJWT()
    setAppState({ type: ACTION_TYPE.STATUS_NEEDS_MANUAL_LOGIN })
    return
  }

  // 3) Store user data and set status to AUTHENTICATED_ATTEMPTING_SOCKET
  setAppState({
    type: ACTION_TYPE.STATUS_AUTHENTICATED_NO_SOCKET,
    payload: {
      user: {
        userName: meResponse.data.username,
        id: meResponse.data._id,
        jwt: previousSessionJWT,
      },
      appState: APP_INIT_STATUS.AUTHENTICATED_ATTEMPTING_SOCKET,
    },
  })

  // 4) Try to establish a websocket connection
  socketConn.auth = { jwt: previousSessionJWT }
  socketConn.connect()
}

// ===================================================

/**
 *
 * @param {*} WrappedComponent
 * @returns
 */
export const withHandleAppInit = (WrappedComponent) => (props) => {
  const socketConn = useSocketContext()
  const [appState, setAppState] = useAppContext()

  const attemptResumeSession = useCallback(
    (jwt) => {
      setAppState({ type: ACTION_TYPE.STATUS_ATTEMPTING_RESUME_SESSION })
      attemptToResumeSession(jwt, setAppState, socketConn)
    },
    [socketConn, setAppState]
  )

  /**
   * This is the App Init's Step #1.
   * The status starts out NONE.
   * This is the point where the app decides if it should try
   * to resume a previous session, or take the user to login.
   */
  useEffect(() => {
    const previousSessionJWT = localStore.getJWT()
    const alreadyTriedToResume = appState.attemptedToResumeSession
    if (!alreadyTriedToResume && !!previousSessionJWT) {
      attemptResumeSession(previousSessionJWT)
    } else {
      setAppState({ type: ACTION_TYPE.STATUS_NEEDS_MANUAL_LOGIN })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (appState.appInitStatus === APP_INIT_STATUS.AUTHENTICATED_WITH_SOCKET) {
    return <WrappedComponent {...props} />
  }

  if (appState.appInitStatus === APP_INIT_STATUS.NEED_TO_LOG_IN) {
    return <LoginPage />
  }

  if (appState.appInitStatus === APP_INIT_STATUS.ERROR_FIRST_CONNECT) {
    return (
      <StatusPage
        mainText="Connection Error"
        detailsText="Could not complete log in."
        cta={
          <button
            onClick={() =>
              setAppState({ type: ACTION_TYPE.STATUS_NEEDS_MANUAL_LOGIN })
            }
          >
            Back to Log In
          </button>
        }
      />
    )
  }

  // The statuses that should show the Loading screen
  // with some loading message.
  let loadingStateText = ''
  switch (appState.appInitStatus) {
    case APP_INIT_STATUS.NONE:
      loadingStateText = ''
      break
    case APP_INIT_STATUS.ATTEMPTING_RESUME_SESSION:
      loadingStateText = 'Attempting to resume previous session.'
      break
    case APP_INIT_STATUS.AUTHENTICATED_ATTEMPTING_SOCKET:
      loadingStateText = 'Attempting websocket connection.'
      break
    default:
      loadingStateText = ''
  }

  return <StatusPage mainText="Loading..." detailsText={loadingStateText} />
}
