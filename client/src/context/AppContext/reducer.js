import Logger from '../../utils/Logger'

export const APP_INIT_STATUS = {
  NONE: 'NONE',
  ATTEMPTING_RESUME_SESSION: 'ATTEMPTING_RESUME_SESSION',
  ATTEMPTING_LOG_IN: 'ATTEMPTING_LOG_IN',
  ERROR_FIRST_CONNECT: 'ERROR_FIRST_CONNECT',
  NEED_TO_LOG_IN: 'NEED_TO_LOG_IN',

  AUTHENTICATED_ATTEMPTING_SOCKET: 'AUTHENTICATED_ATTEMPTING_SOCKET',
  AUTHENTICATED_NO_SOCKET: 'AUTHENTICATED_NO_SOCKET',
  AUTHENTICATED_WITH_SOCKET: 'AUTHENTICATED_WITH_SOCKET',
  ATTEMPTING_SOCKET_CONN: 'ATTEMPTING_SOCKET_CONN',
}

export const MATCH_STATE = {
  // There is no two-player match
  NONE: 'NONE',
  // Waiting for both players to confirm
  LOADING: 'LOADING',
  // Both players confirmed, match is going on now
  PLAYING: 'PLAYING',
}

const EMPTY_MATCH = () => ({
  // status: MATCH_STATE.NONE,
  // opponentID: null,
  // opponentName: null,
  // matchID: null,

  // Fake Stuff
  // status: MATCH_STATE.LOADING,
  status: MATCH_STATE.PLAYING,
  matchID: '5773f037b7beab8da1ff',
  //
  opponentID: '6313e7980d42a681b5cf3482', // captain
  opponentName: 'captain',
  //
  // opponentID: '6313e7940d42a681b5cf347f', // mammaw
  // opponentName: 'mammaw',
})

export const initialAppContextState = {
  // Authentication / User
  user: {
    id: null,
    userName: null,
    jwt: null,
  },

  // Errors
  errors: {
    fetchingInitialChats: null,
    refreshingToken: null,
  },
  socketConnectionError: null, // null or string

  // Notifications
  notifications: {
    haveUnreadChats: false,
    haveUnreadChallenges: false,
  },

  // Session / Connection
  attemptedToResumeSession: false,
  socketHasConnectedOnce: false,
  socketIsCurrentlyConnected: false,

  appInitStatus: APP_INIT_STATUS.NONE,

  // Challenges / Matches
  challenges: {
    toYou: [], // [{ matchID, userID }]
    fromYou: [], // [{ matchID, userID }]
  },
  // Two-Player match state
  match: EMPTY_MATCH(),

  // Users
  allUsers: [],
  hasFetchedInitialUsers: false,

  // Chats
  chatMessages: [],
  hasFetchedInitialChats: false,
}

export const ACTION_TYPE = {
  STATUS_AUTHENTICATED_NO_SOCKET: 'STATUS_AUTHENTICATED_NO_SOCKET',
  STATUS_AUTHENTICATED_WITH_SOCKET: 'STATUS_AUTHENTICATED_WITH_SOCKET',
  STATUS_NEEDS_MANUAL_LOGIN: 'STATUS_NEEDS_MANUAL_LOGIN',
  STATUS_ATTEMPTING_RESUME_SESSION: 'STATUS_ATTEMPTING_RESUME_SESSION',
  SET_APP_INIT_STATUS: 'SET_APP_INIT_STATUS',
  SET_SOCKET_CONNECTED: 'SET_SOCKET_CONNECTED',
  SET_SOCKET_DISCONNECTED: 'SET_SOCKET_DISCONNECTED',
  SET_SOCKET_CONNECTION_ERROR: 'SET_SOCKET_CONNECTION_ERROR',
  SET_ALL_USERS: 'SET_ALL_USERS',
  SET_CHALLENGES: 'SET_CHALLENGES',
  SET_ALL_CHATS: 'SET_ALL_CHATS',
  HAS_FETCHED_INITIAL_CHATS: 'HAS_FETCHED_INITIAL_CHATS',
  HAS_FETCHED_INITIAL_USERS: 'HAS_FETCHED_INITIAL_USERS',
  SET_HAS_UNREAD_CHATS: 'SET_HAS_UNREAD_CHATS',
  // Match
  SET_MATCH_LOADING: 'SET_MATCH_LOADING',
  SET_MATCH_STARTED: 'SET_MATCH_STARTED',
  SET_MATCH_CLEAR: 'SET_MATCH_CLEAR',
}

export const appContextReducer = (state, { type, payload }) => {
  Logger.state(`Reducer(AppContext)::"${type}"`, payload)

  switch (type) {
    // Authenticated with JWT and validated with /me,
    // but has not established the first websocket conn yet.
    case ACTION_TYPE.STATUS_AUTHENTICATED_NO_SOCKET:
      return {
        ...state,
        user: {
          ...state.user,
          userName: payload.user.userName,
          id: payload.user.id,
          jwt: payload.user.jwt,
        },
        socketHasConnectedOnce: false,
        socketIsCurrentlyConnected: false,
        socketConnectionError: null,
        appInitStatus:
          payload.appState ?? APP_INIT_STATUS.AUTHENTICATED_NO_SOCKET,
      }
    // Authenticated with JWT and validated with /me,
    // and has established the first websocket conn.
    case ACTION_TYPE.STATUS_AUTHENTICATED_WITH_SOCKET:
      return {
        ...state,
        socketHasConnectedOnce: true,
        socketIsCurrentlyConnected: true,
        socketConnectionError: null,
        appInitStatus: APP_INIT_STATUS.AUTHENTICATED_WITH_SOCKET,
      }
    //
    case ACTION_TYPE.STATUS_NEEDS_MANUAL_LOGIN:
      return {
        ...state,
        user: { id: null, userName: null, jwt: null },
        socketHasConnectedOnce: false,
        socketIsCurrentlyConnected: false,
        socketConnectionError: null,
        appInitStatus: APP_INIT_STATUS.NEED_TO_LOG_IN,
      }
    case ACTION_TYPE.STATUS_ATTEMPTING_RESUME_SESSION:
      return {
        ...state,
        attemptedToResumeSession: true,
        appInitStatus: APP_INIT_STATUS.ATTEMPTING_RESUME_SESSION,
      }
    case ACTION_TYPE.SET_APP_INIT_STATUS:
      return {
        ...state,
        appInitStatus: payload,
      }
    case ACTION_TYPE.SET_SOCKET_CONNECTED:
      return {
        ...state,
        socketIsCurrentlyConnected: true,
        socketHasConnectedOnce: true,
      }
    case ACTION_TYPE.SET_SOCKET_DISCONNECTED:
      return {
        ...state,
        socketIsCurrentlyConnected: false,
      }
    case ACTION_TYPE.SET_SOCKET_CONNECTION_ERROR:
      return {
        ...state,
        socketIsCurrentlyConnected: false,
        socketConnectionError: payload,
      }
    case ACTION_TYPE.SET_ALL_USERS:
      return {
        ...state,
        allUsers: Array.isArray(payload) ? payload : [],
      }
    case ACTION_TYPE.SET_CHALLENGES:
      return {
        ...state,
        challenges: {
          ...state.challenges,
          toYou: Array.isArray(payload.toYou) ? payload.toYou : [],
          fromYou: Array.isArray(payload.fromYou) ? payload.fromYou : [],
        },
      }
    case ACTION_TYPE.SET_ALL_CHATS:
      return {
        ...state,
        chatMessages: Array.isArray(payload) ? payload : [],
        hasFetchedInitialChats: true,
        notifications: {
          ...state.notifications,
          haveUnreadChats: true,
        },
      }
    case ACTION_TYPE.HAS_FETCHED_INITIAL_CHATS:
      return {
        ...state,
        hasFetchedInitialChats: true,
      }
    case ACTION_TYPE.HAS_FETCHED_INITIAL_USERS:
      return {
        ...state,
        hasFetchedInitialUsers: true,
      }
    case ACTION_TYPE.SET_HAS_UNREAD_CHATS:
      return {
        ...state,
        notifications: {
          ...state.notifications,
          haveUnreadChats: !!payload,
        },
      }
    case ACTION_TYPE.SET_MATCH_LOADING:
      return {
        ...state,
        match: {
          status: MATCH_STATE.LOADING,
          opponentID: payload?.opponentID,
          opponentName: payload?.opponentName,
          matchID: payload?.matchID,
        },
      }
    case ACTION_TYPE.SET_MATCH_STARTED:
      return {
        ...state,
        match: {
          ...state.match,
          status: MATCH_STATE.PLAYING,
        },
      }
    case ACTION_TYPE.SET_MATCH_CLEAR:
      return {
        ...state,
        match: EMPTY_MATCH(),
      }
    default:
      return state
  }
}
