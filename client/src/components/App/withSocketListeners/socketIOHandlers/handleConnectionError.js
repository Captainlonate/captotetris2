import { toast } from 'react-toastify'

import Logger from '../../../../utils/Logger'
import { ACTION_TYPE, APP_INIT_STATUS } from '../../../../context/AppContext'

// ===================================================

const SOCKETIO_ERROR_CODES = {
  JWT_EXPIRED: 'JWT_EXPIRED',
  JWT_MISSING_FIELDS: 'JWT_MISSING_FIELDS',
  JWT_UNVERIFIABLE: 'JWT_UNVERIFIABLE',
  JWT_MISSING: 'JWT_MISSING',
}

// ===================================================

/*
  When YOUR connection has an error
*/
export const handleConnectionError = (appState, setAppState) => (errObj) => {
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
