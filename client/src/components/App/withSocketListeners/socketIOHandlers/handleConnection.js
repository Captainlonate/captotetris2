import { ACTION_TYPE, APP_INIT_STATUS } from '../../../../context/AppContext'

// ===================================================

/*
  This is when YOU connect
*/
export const handleConnection = (appState, setAppState) => () => {
  if (appState.appInitStatus !== APP_INIT_STATUS.AUTHENTICATED_WITH_SOCKET) {
    setAppState({ type: ACTION_TYPE.STATUS_AUTHENTICATED_WITH_SOCKET })
  } else {
    setAppState({ type: ACTION_TYPE.SET_SOCKET_CONNECTED })
  }
}
