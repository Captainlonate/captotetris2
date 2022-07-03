import { pipe, reject, append, sort, propEq } from 'ramda'

import { APP_INIT_STATUS } from '../../../context/AppContext/reducer'
import { setSocketSession, clearSocketSession } from '../../../localStorage/localStorage'

// ===================================================

const addOrUpdateUser = (updatedUser) => pipe(
  reject(propEq('userID', updatedUser.userID)),
  append(updatedUser),
  sort((a, b) => a.userID - b.userID)
)

const setUserOffline = (userID, allUsers) => {
  // create a new array and copy object references
  return allUsers.map((user) => ({
    ...user,
    connected: userID === user.userID ? false : user.connected
  }))
}

// =================================================================

/*

*/
export const handleConnection = (appState, setAppState) => (msg = '') => {
  console.log(`-- SOCKET EVENT -- Connected: '${msg}'`, msg, typeof msg)
  if (appState.appInitStatus !== APP_INIT_STATUS.DONE) {
    if (appState.hasSetSocketSession) {
      setAppState({ type: 'SET_APP_INIT_STATUS', payload: APP_INIT_STATUS.DONE })
    } else {
      setAppState({ type: 'SET_APP_INIT_STATUS', payload: APP_INIT_STATUS.CONNECTED_WAITING_SERVER_SESSION })
    }
  }
  setAppState({ type: 'SET_SOCKET_CONNECTED' })
}

/*

*/
export const handleDisconnect = (appState, setAppState, socketConn) => (msg) => {
  console.log(`-- SOCKET EVENT -- Disconnected: '${msg}'`, msg, typeof msg)
  setAppState({ type: 'SET_SOCKET_DISCONNECTED' })
}

/*

*/
export const handleReceiveSessionInfo = (appState, setAppState, socketConn) => (sessionInfo) => {
  console.log("-- SOCKET EVENT -- Session Information Received from server.", sessionInfo)
  setSocketSession({
    sessionID: sessionInfo.sessionID,
    userID: sessionInfo.userID,
    userName: sessionInfo.userName
  })
  setAppState({ type: 'SET_SOCKET_SESSION', payload: sessionInfo })
  setAppState({ type: 'SET_APP_INIT_STATUS', payload: APP_INIT_STATUS.DONE })
}

/*

*/
export const handleConnectionError = (appState, setAppState, socketConn) => (errObj) => {
  console.log("-- SOCKET EVENT -- Connection Error", errObj)
  if (errObj.message === 'expired_session') {
    console.log('Expired Session!')
    clearSocketSession()
    setAppState({ type: 'SET_APP_INIT_STATUS', payload: APP_INIT_STATUS.NEED_TO_LOG_IN })
  } else {
    setAppState({ type: 'SET_APP_INIT_STATUS', payload: APP_INIT_STATUS.ERROR_FIRST_CONNECT })
  }
}

/*

*/
export const handleOtherUserConnected = (appState, setAppState, socketConn) => (connectedUser) => {
  console.log("-- SOCKET EVENT -- A user connected.", connectedUser)
  const updatedUsers = addOrUpdateUser(connectedUser)(appState.allUsers)
  setAppState({ type: 'SET_ALL_USERS', payload: updatedUsers })
}

/*

*/
export const handleOtherUserDisconnected = (appState, setAppState, socketConn) => (disconnectedUserID) => {
  console.log("-- SOCKET EVENT -- A user DISconnected.", disconnectedUserID)
  const updatedUsers = setUserOffline(disconnectedUserID, appState.allUsers)
  setAppState({ type: 'SET_ALL_USERS', payload: updatedUsers })
}

/*

*/
export const handleChallengeStatusUpdated = (appState, setAppState, socketConn) => (challengeStatus = {}) => {
  console.log(`-- SOCKET EVENT -- Received updated challenge status.`, challengeStatus)
  setAppState({
    type: 'SET_CHALLENGES',
    payload: {
      byYou: challengeStatus?.everyoneYouChallenged ?? [],
      toYou: challengeStatus?.everyoneWhoChallengedYou ?? [],
    }
  })
}

/*

*/
export const handleSomeonePostedNewMessage = (appState, setAppState, socketConn) => (newChatMessage = {}) => {
  console.log(`-- SOCKET EVENT -- Someone posted a new chat message.`, newChatMessage)
  const updatedChatMessages = [...appState?.chatMessages, newChatMessage]
  setAppState({ type: 'SET_ALL_CHATS', payload: updatedChatMessages })
}
