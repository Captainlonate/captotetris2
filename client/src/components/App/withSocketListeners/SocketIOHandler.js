import { pipe, reject, append, sort, propEq } from 'ramda'

import {
  ACTION_TYPE,
  APP_INIT_STATUS,
} from '../../../context/AppContext/reducer'
import Logger from '../../../utils/Logger'
import { toast } from 'react-toastify'
import { normalizeUsersFromApiForCtx } from '../../../context/AppContext/utils'
import { normalizeChatMessageFromApiForCtx } from '../../../context/AppContext/utils'

// ===================================================

const addOrUpdateUser = (updatedUser) =>
  pipe(
    reject(propEq('userId', updatedUser.userId)),
    append(updatedUser),
    sort((a, b) => a.userId - b.userId)
  )

const setUserOffline = (userId, allUsers) => {
  // create a new array and copy object references
  return allUsers.map((user) => ({
    ...user,
    online: userId === user.userId ? false : user.online,
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
    Logger.network(`-- SOCKET EVENT -- Connected`)
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
    Logger.network(`-- SOCKET EVENT -- Disconnected: '${msg}'`, msg, typeof msg)
    setAppState({ type: ACTION_TYPE.SET_SOCKET_DISCONNECTED })
  }

/*
  When YOUR connection has an error
*/
export const handleConnectionError =
  (appState, setAppState, socketConn) => (errObj) => {
    Logger.network('-- SOCKET EVENT -- Connection Error', {
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

    // Is this a disconnect that occured after already being
    // connected, or is it a failed initial-connection
    if (wasAlreadyConnected) {
      if (probablyDueToNetwork) {
        // If there is an actual connection/network problem, nothing
        // can be done.
        Logger.error('Websocket connection seems to have a network error.')
      } else if (expiredJWT) {
        // If the JWT expired, we might be able to refresh it
        Logger.debug('Websocket JWT Expired, need to refresh.')
        toast('Connection restored, but session expired. Re-Login')
      } else if (badJWT) {
        // The server has specifically told us what's wrong
        // with the JWT, but we probably need to re-login
        // to get a clean one.
        Logger.error('Websocket JWT has some issue.')
      } else {
        // If the reason is unknown, not much can be done
        // except attempt to re-login
        Logger.error('Unknown reason for disconnect.')
      }
      setAppState({ type: ACTION_TYPE.SET_SOCKET_DISCONNECTED })
    } else {
      // If we weren't already connected, this is an error
      // with the initial connection
      Logger.error('Websocket connection failed on the first attempt.')
      setAppState({
        type: ACTION_TYPE.SET_APP_INIT_STATUS,
        payload: APP_INIT_STATUS.ERROR_FIRST_CONNECT,
      })
    }
  }

/*
  When you receive a list of all users (and if they are online)
*/
export const handleReceivedAllUsers =
  (appState, setAppState, socketConn) => (allUserObjects) => {
    Logger.network('-- SOCKET EVENT -- Received all users.', allUserObjects)
    const normalizedUsers = allUserObjects.map(normalizeUsersFromApiForCtx)
    setAppState({ type: ACTION_TYPE.SET_ALL_USERS, payload: normalizedUsers })
  }

/*
  When someone else comes online
*/
export const handleOtherUserConnected =
  (appState, setAppState, socketConn) => (connectedUserObj) => {
    Logger.network('-- SOCKET EVENT -- A user connected.', connectedUserObj)
    const normalizedUser = normalizeUsersFromApiForCtx(connectedUserObj)
    const updatedUsers = addOrUpdateUser(normalizedUser)(appState.allUsers)
    setAppState({ type: ACTION_TYPE.SET_ALL_USERS, payload: updatedUsers })
  }

/*
  When someone else goes offline
*/
export const handleOtherUserDisconnected =
  (appState, setAppState, socketConn) => (disconnectedUserID) => {
    Logger.network(
      '-- SOCKET EVENT -- A user DISconnected.',
      disconnectedUserID
    )
    const updatedUsers = setUserOffline(disconnectedUserID, appState.allUsers)
    setAppState({ type: ACTION_TYPE.SET_ALL_USERS, payload: updatedUsers })
  }

/*

*/
export const handleChallengeStatusUpdated =
  (appState, setAppState, socketConn) =>
  (challengeStatus = {}) => {
    Logger.network(
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
  When someone posts a new message (it could be you too)
*/
export const handleSomeonePostedNewMessage =
  (appState, setAppState, socketConn) =>
  (newChatMessage = {}) => {
    Logger.network(
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
