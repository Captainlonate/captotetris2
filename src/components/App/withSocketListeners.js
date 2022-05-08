import { useEffect } from 'react'

import { useSocketContext } from '../../context/SocketContext'
import { SOCKET_EVENTS } from '../../network/socketio'
import { useAppContext } from '../../context/AppContext'
import { APP_INIT_STATUS } from '../../context/AppContext/reducer'
import { setSocketSession } from '../../localStorage/localStorage'
import { pipe, reject, append, sort, propEq } from 'ramda'

// ===================================================

const addOrUpdateUser = (updatedUser) => pipe(
  reject(propEq('userID', updatedUser.userID)),
  append(updatedUser),
  sort((a, b) => a.userID - b.userID)
)

const setUserOffline = (userID, allUsers) => {
  // new array and copy object references
  return allUsers.map((user) => ({
    ...user,
    connected: userID === user.userID ? false : user.connected
  }))
}

// ===================================================

export const withSocketListeners = (WrappedComponent) => (props) => {
  const socketConn = useSocketContext()
  const [appState, setAppState] = useAppContext()

  useEffect(() => {
    console.log('Attaching listeners...')
    const onConnect = (msg = '') => {
      console.log("-- SOCKET EVENT -- Connected", msg)
      if (appState.appInitStatus !== APP_INIT_STATUS.DONE) {
        if (appState.hasSetSocketSession) {
          setAppState({ type: 'SET_APP_INIT_STATUS', payload: APP_INIT_STATUS.DONE })
        } else {
          setAppState({ type: 'SET_APP_INIT_STATUS', payload: APP_INIT_STATUS.CONNECTED_WAITING_SERVER_SESSION })
        }
      }
      setAppState({ type: 'SET_SOCKET_CONNECTED' })
    }

    const onDisconnect = (msg = '') => {
      console.log("-- SOCKET EVENT -- Disconnected", msg)
      setAppState({ type: 'SET_SOCKET_DISCONNECTED' })
    }

    const onConnectionError = (msg = '') => {
      console.log("-- SOCKET EVENT -- Connection Error", msg)
      setAppState({ type: 'SET_APP_INIT_STATUS', payload: APP_INIT_STATUS.ERROR_FIRST_CONNECT })
      // setAppState({ type: 'SET_SOCKET_CONNECTION_ERROR', payload: 'Socket Connection Error!: ' + msg })
    }

    const onReceiveSession = (sessionInfo) => {
      console.log("-- SOCKET EVENT -- Session Information Received from server.", sessionInfo)
      setSocketSession({
        sessionID: sessionInfo.sessionID,
        userID: sessionInfo.userID,
        userName: sessionInfo.userName
      })
      setAppState({ type: 'SET_SOCKET_SESSION', payload: sessionInfo })
      setAppState({ type: 'SET_APP_INIT_STATUS', payload: APP_INIT_STATUS.DONE })
    }

    const onReceiveAllUsers = (users) => {
      console.log("-- SOCKET EVENT -- Received all users", users)
      setAppState({ type: 'SET_ALL_USERS', payload: users })
    }

    const onUserConnected = (connectedUser) => {
      console.log("-- SOCKET EVENT -- A user connected.", connectedUser)
      const updatedUsers = addOrUpdateUser(connectedUser)(appState.allUsers)
      setAppState({ type: 'SET_ALL_USERS', payload: updatedUsers })
    }

    const onUserDisconnected = (disconnectedUserID) => {
      console.log("-- SOCKET EVENT -- A user DISconnected.", disconnectedUserID)
      const updatedUsers = setUserOffline(disconnectedUserID, appState.allUsers)
      setAppState({ type: 'SET_ALL_USERS', payload: updatedUsers })
    }

    const onChallenged = (challengerID) => {
      console.log(`-- SOCKET EVENT -- User ${challengerID} has challenged you.`)
      // const updatedUsers = setUserOffline(disconnectedUserID, appState.allUsers)
      // setAppState({ type: 'SET_ALL_USERS', payload: updatedUsers })
    }

    socketConn.on(SOCKET_EVENTS.CONNECT, onConnect)
    socketConn.on(SOCKET_EVENTS.DISCONNECT, onDisconnect)
    socketConn.on(SOCKET_EVENTS.CONNECT_ERROR, onConnectionError)
    socketConn.on(SOCKET_EVENTS.SESSION, onReceiveSession)
    socketConn.on(SOCKET_EVENTS.USERS, onReceiveAllUsers)
    socketConn.on(SOCKET_EVENTS.USER_CONNECTED, onUserConnected)
    socketConn.on(SOCKET_EVENTS.USER_DISCONNECTED, onUserDisconnected)
    socketConn.on(SOCKET_EVENTS.CHALLENGED, onChallenged)

    return () => {
      socketConn.off(SOCKET_EVENTS.CONNECT, onConnect)
      socketConn.off(SOCKET_EVENTS.DISCONNECT, onDisconnect)
      socketConn.off(SOCKET_EVENTS.CONNECT_ERROR, onConnectionError)
      socketConn.off(SOCKET_EVENTS.SESSION, onReceiveSession)
      socketConn.off(SOCKET_EVENTS.USERS, onReceiveAllUsers)
      socketConn.off(SOCKET_EVENTS.USER_CONNECTED, onUserConnected)
      socketConn.off(SOCKET_EVENTS.USER_DISCONNECTED, onUserDisconnected)
      socketConn.off(SOCKET_EVENTS.CHALLENGED, onChallenged)
    }
  }, [appState, socketConn, setAppState])

  return <WrappedComponent {...props} />
}