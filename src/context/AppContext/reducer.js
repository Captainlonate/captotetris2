export const initialAppContextState = {
  socketSessionID: null,
  socketUserID: null,
  socketUserName: null,
  allUsers: [],
  socketIsConnected: false,
  hasReceivedSession: false,
  hasCheckedLocalStorageForSession: false
}

export const appContextReducer = (state, { type, payload }) => {
  switch (type) {
    case 'SET_SOCKET_SESSION':
      return {
        ...state,
        hasCheckedLocalStorageForSession: true,
        hasReceivedSession: true,
        socketSessionID: payload.sessionID,
        socketUserID: payload.userID,
        socketUserName: payload.userName
      }
    case 'SET_SOCKET_CONNECTED':
      return {
        ...state,
        socketIsConnected: !!payload.isConnected
      }
    case 'SET_ALL_USERS':
      return {
        ...state,
        allUsers: payload.allUsers ?? []
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
