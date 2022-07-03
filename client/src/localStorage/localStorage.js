// Never use these field keys outside of this file and only
// expose functions for interacting with them.
const FIELDS = {
  SOCKET_SESSIONID: "SOCKET_SESSIONID",
  SOCKET_USERID: "SOCKET_USERID",
  SOCKET_USERNAME: "SOCKET_USERNAME",
};

//======================================================
//====================Socket Auth=======================
//======================================================

export const setSocketSession = ({ sessionID = '', userID = '', userName = '' }) => {
  window.localStorage.setItem(FIELDS.SOCKET_SESSIONID, sessionID)
  window.localStorage.setItem(FIELDS.SOCKET_USERID, userID)
  window.localStorage.setItem(FIELDS.SOCKET_USERNAME, userName)
}

export const clearSocketSession = () => {
  window.localStorage.removeItem(FIELDS.SOCKET_SESSIONID)
  window.localStorage.removeItem(FIELDS.SOCKET_USERID)
  window.localStorage.removeItem(FIELDS.SOCKET_USERNAME)
}

export const getSocketSession = () => {
  return {
    sessionID: window.localStorage.getItem(FIELDS.SOCKET_SESSIONID),
    userID: window.localStorage.getItem(FIELDS.SOCKET_USERID),
    userName: window.localStorage.getItem(FIELDS.SOCKET_USERNAME),
  }
}