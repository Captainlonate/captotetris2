export const APP_INIT_STATUS = {
  NONE: 'NONE',
  ATTEMPTING_RESUME_SESSION: 'ATTEMPTING_RESUME_SESSION',
  ATTEMPTING_LOG_IN: 'ATTEMPTING_LOG_IN',
  ERROR_FIRST_CONNECT: 'ERROR_FIRST_CONNECT',
  NEED_TO_LOG_IN: 'NEED_TO_LOG_IN',
  CONNECTED_WAITING_SERVER_SESSION: 'CONNECTED_WAITING_SERVER_SESSION',
  DONE: 'DONE'
}

export const initialAppContextState = {
  socketSessionID: null,
  socketUserID: null,
  socketUserName: null,
  allUsers: [],
  socketHasConnectedOnce: false, // boolean
  socketIsCurrentlyConnected: false, // boolean
  // socketTryingToConnect: false, // boolean
  socketConnectionError: null, // null or string
  // socketReceivedInitialResponse: false, // boolean
  hasSetSocketSession: false, // boolean
  // hasCheckedLocalStorageForSession: false, // boolean

  appInitStatus: APP_INIT_STATUS.NONE,
  // appInitDone: false, // boolean
  // foundPreviousSession: null,  // null or boolean
}

export const appContextReducer = (state, { type, payload }) => {
  switch (type) {
    case 'SET_APP_INIT_STATUS':
      return {
        ...state,
        appInitStatus: payload,
      }
    // case 'SET_CHECKED_SOCKET_STORAGE':
    //   return {
    //     ...state,
    //     hasCheckedLocalStorageForSession: !!payload,
    //   }
    case 'SET_SOCKET_SESSION':
      return {
        ...state,
        hasSetSocketSession: true,
        socketSessionID: payload.sessionID,
        socketUserID: payload.userID,
        socketUserName: payload.userName
      }
    // case 'SET_SOCKET_PENDING_CONNECT':
    //   return {
    //     ...state,
    //     socketTryingToConnect: !!payload
    //   }
    // case 'SET_SOCKET_INITIAL_CONNECT_FINISHED':
    //   return {
    //     ...state,
    //     socketReceivedInitialResponse: !!payload
    //   }
    case 'SET_SOCKET_CONNECTED':
      return {
        ...state,
        socketIsCurrentlyConnected: true,
        socketHasConnectedOnce: true,
      }
    case 'SET_SOCKET_DISCONNECTED':
      return {
        ...state,
        socketIsCurrentlyConnected: false
      }
    case 'SET_SOCKET_CONNECTION_ERROR':
      return {
        ...state,
        socketIsCurrentlyConnected: false,
        socketConnectionError: payload
      }
    case 'SET_ALL_USERS':
      return {
        ...state,
        allUsers: Array.isArray(payload) ? payload : []
      }
    case 'OTHER_USER_CONNECTED':
      return {
        ...state,
        // allUsers: payload.allUsers ?? []
      }
    case 'OTHER_USER_DISCONNECTED':
      return {
        ...state,
        // allUsers: payload.allUsers ?? []
      }
    default:
      return state
  }
}
