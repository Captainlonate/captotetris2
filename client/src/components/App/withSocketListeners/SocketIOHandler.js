import { pipe, reject, append, sort, propEq } from 'ramda'

import {
  ACTION_TYPE,
  APP_INIT_STATUS,
} from '../../../context/AppContext/reducer'
import { normalizeChatMessageFromApiForCtx } from '../../../context/AppContext/utils'

// ===================================================

const addOrUpdateUser = (updatedUser) =>
  pipe(
    reject(propEq('userID', updatedUser.userID)),
    append(updatedUser),
    sort((a, b) => a.userID - b.userID)
  )

const setUserOffline = (userID, allUsers) => {
  // create a new array and copy object references
  return allUsers.map((user) => ({
    ...user,
    connected: userID === user.userID ? false : user.connected,
  }))
}

const SOCKETIO_ERROR_CODES = {
  JWT_EXPIRED: 'JWT_EXPIRED',
  JWT_MISSING_FIELDS: 'JWT_MISSING_FIELDS',
  JWT_UNVERIFIABLE: 'JWT_UNVERIFIABLE',
  JWT_MISSING: 'JWT_MISSING',
}

// =================================================================

/*
  This is when YOU connect
*/
export const handleConnection =
  (appState, setAppState) =>
  (msg = '') => {
    console.log(`-- SOCKET EVENT -- Connected: '${msg}'`, msg)
    if (appState.appInitStatus !== APP_INIT_STATUS.AUTHENTICATED_WITH_SOCKET) {
      setAppState({ type: ACTION_TYPE.STATUS_AUTHENTICATED_WITH_SOCKET })
    } else {
      setAppState({ type: ACTION_TYPE.SET_SOCKET_CONNECTED })
    }
  }

/*
  This is when YOU disconnect
*/
export const handleDisconnect =
  (appState, setAppState, socketConn) => (msg) => {
    console.log(`-- SOCKET EVENT -- Disconnected: '${msg}'`, msg, typeof msg)
    setAppState({ type: ACTION_TYPE.SET_SOCKET_DISCONNECTED })
  }

/*

*/
// export const handleReceiveSessionInfo = (appState, setAppState, socketConn) => (sessionInfo) => {
//   console.log("-- SOCKET EVENT -- Session Information Received from server.", sessionInfo)
//   setSocketSession({
//     sessionID: sessionInfo.sessionID,
//     userID: sessionInfo.userID,
//     userName: sessionInfo.userName
//   })
//   setAppState({ type: 'SET_SOCKET_SESSION', payload: sessionInfo })
//   setAppState({ type: 'SET_APP_INIT_STATUS', payload: APP_INIT_STATUS.DONE })
// }

/*
  When YOUR connection has an error
*/
export const handleConnectionError =
  (appState, setAppState, socketConn) => (errObj) => {
    console.log('-- SOCKET EVENT -- Connection Error', {
      message: errObj.message,
      errObj,
    })

    const expiredJWT = errObj.message === SOCKETIO_ERROR_CODES.JWT_EXPIRED
    const missingFields =
      errObj.message === SOCKETIO_ERROR_CODES.JWT_MISSING_FIELDS
    const jwtUnverifiable =
      errObj.message === SOCKETIO_ERROR_CODES.JWT_UNVERIFIABLE
    const noJWT = errObj.message === SOCKETIO_ERROR_CODES.JWT_MISSING
    const wasAlreadyConnected = appState.socketHasConnectedOnce
    const badJWT = noJWT || jwtUnverifiable || missingFields
    const probablyDueToNetwork = errObj.message.includes('xhr poll error')

    console.log('Websocket error debug', {
      expiredJWT,
      missingFields,
      jwtUnverifiable,
      noJWT,
      wasAlreadyConnected,
      badJWT,
      probablyDueToNetwork,
    })

    // Is this a disconnect that occured after already being
    // connected, or is it a failed initial-connection
    if (wasAlreadyConnected) {
      if (probablyDueToNetwork) {
        // If there is an actual connection/network problem, nothing
        // can be done.
        console.log('Websocket connection seems to have a network error.')
      } else if (expiredJWT) {
        // If the JWT expired, we might be able to refresh it
        console.log('Websocket JWT Expired, need to refresh.')
      } else if (badJWT) {
        // The server has specifically told us what's wrong
        // with the JWT, but we probably need to re-login
        // to get a clean one.
        console.log('Websocket JWT has some issue.')
      } else {
        // If the reason is unknown, not much can be done
        // except attempt to re-login
        console.log('Unknown reason for disconnect.')
      }
      setAppState({ type: ACTION_TYPE.SET_SOCKET_DISCONNECTED })
    } else {
      // If we weren't already connected, this is an error
      // with the initial connection
      console.log('Websocket connection failed on the first attempt.')
      setAppState({
        type: ACTION_TYPE.SET_APP_INIT_STATUS,
        payload: APP_INIT_STATUS.ERROR_FIRST_CONNECT,
      })
    }
  }

/*

*/
export const handleOtherUserConnected =
  (appState, setAppState, socketConn) => (connectedUser) => {
    console.log('-- SOCKET EVENT -- A user connected.', connectedUser)
    const updatedUsers = addOrUpdateUser(connectedUser)(appState.allUsers)
    setAppState({ type: ACTION_TYPE.SET_ALL_USERS, payload: updatedUsers })
  }

/*

*/
export const handleOtherUserDisconnected =
  (appState, setAppState, socketConn) => (disconnectedUserID) => {
    console.log('-- SOCKET EVENT -- A user DISconnected.', disconnectedUserID)
    const updatedUsers = setUserOffline(disconnectedUserID, appState.allUsers)
    setAppState({ type: ACTION_TYPE.SET_ALL_USERS, payload: updatedUsers })
  }

/*

*/
export const handleChallengeStatusUpdated =
  (appState, setAppState, socketConn) =>
  (challengeStatus = {}) => {
    console.log(
      `-- SOCKET EVENT -- Received updated challenge status.`,
      challengeStatus
    )
    setAppState({
      type: ACTION_TYPE.SET_CHALLENGES,
      payload: {
        byYou: challengeStatus?.everyoneYouChallenged ?? [],
        toYou: challengeStatus?.everyoneWhoChallengedYou ?? [],
      },
    })
  }

/*

*/
export const handleSomeonePostedNewMessage =
  (appState, setAppState, socketConn) =>
  (newChatMessage = {}) => {
    console.log(
      `-- SOCKET EVENT -- Someone posted a new chat message.`,
      newChatMessage
    )
    if (newChatMessage) {
      const normalizedChatMessage = normalizeChatMessageFromApiForCtx(
        newChatMessage ?? {}
      )
      const updatedChatMessages = [
        ...appState?.chatMessages,
        normalizedChatMessage,
      ]
      setAppState({
        type: ACTION_TYPE.SET_ALL_CHATS,
        payload: updatedChatMessages,
      })
    }
  }
