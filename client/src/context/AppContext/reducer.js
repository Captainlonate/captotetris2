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
  socketConnectionError: null, // null or string
  hasSetSocketSession: false, // boolean
  appInitStatus: APP_INIT_STATUS.NONE,
  usersWhoChallengedYou: [],
  usersYouChallenged: [],
  chatMessages: [
    // { id: '0001', authorName: 'Maximus Decimus Meridius', message: 'Is anyone here?' },
    // { id: '0002', authorName: 'Emporer Commodus', message: 'Yeah, I\'m here.' },
    // { id: '0003', authorName: 'Maximus Decimus Meridius', message: 'Want to play?' },
    // { id: '0004', authorName: 'Emporer Commodus', message: 'Let\'s go!' },
  ]
}

export const appContextReducer = (state, { type, payload }) => {
  switch (type) {
    case 'SET_APP_INIT_STATUS':
      return {
        ...state,
        appInitStatus: payload,
      }
    case 'SET_SOCKET_SESSION':
      return {
        ...state,
        hasSetSocketSession: true,
        socketSessionID: payload.sessionID,
        socketUserID: payload.userID,
        socketUserName: payload.userName
      }
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
    case 'SET_CHALLENGES':
      return {
        ...state,
        usersYouChallenged: Array.isArray(payload?.byYou) ? payload?.byYou : [],
        usersWhoChallengedYou: Array.isArray(payload?.toYou) ? payload?.toYou : []
      }
    case 'SET_ALL_CHATS':
      return {
        ...state,
        chatMessages: Array.isArray(payload) ? payload : []
      }
    // case 'SET_CHALLENGES_BY_YOU':
    //   return {
    //     ...state,
    //     usersYouChallenged: Array.isArray(payload) ? payload : []
    //   }
    // case 'SET_CHALLENGES_TO_YOU':
    //   return {
    //     ...state,
    //     usersWhoChallengedYou: Array.isArray(payload) ? payload : []
    //   }
    default:
      return state
  }
}
