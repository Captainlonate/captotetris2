import { ACTION_TYPE } from '../../../../context/AppContext'

// ===================================================

/*
  This is when YOU disconnect
*/
export const handleDisconnect = (appState, setAppState) => (msg) => {
  setAppState({ type: ACTION_TYPE.SET_SOCKET_DISCONNECTED })
}
