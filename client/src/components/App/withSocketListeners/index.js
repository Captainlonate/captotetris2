import { useEffect } from 'react'

import { useSocketContext } from '../../../context/SocketContext'
import { SOCKET_EVENTS } from '../../../network/socketio'
import { useAppContext } from '../../../context/AppContext'
import * as SocketIOHandler from './SocketIOHandler'

// ===================================================

export const withSocketListeners = (WrappedComponent) => (props) => {
  const socketConn = useSocketContext()
  const [appState, setAppState] = useAppContext()

  useEffect(() => {
    const onConnect = SocketIOHandler.handleConnection(appState, setAppState, socketConn)
    const onDisconnect = SocketIOHandler.handleDisconnect(appState, setAppState, socketConn)
    const onConnectionError = SocketIOHandler.handleConnectionError(appState, setAppState, socketConn)
    // const onReceiveSession = SocketIOHandler.handleReceiveSessionInfo(appState, setAppState, socketConn)
    const onUserConnected = SocketIOHandler.handleOtherUserConnected(appState, setAppState, socketConn)
    const onUserDisconnected = SocketIOHandler.handleOtherUserDisconnected(appState, setAppState, socketConn)
    const onChallengeStatusReceived = SocketIOHandler.handleChallengeStatusUpdated(appState, setAppState, socketConn)
    const onSomeonePostedNewMessage = SocketIOHandler.handleSomeonePostedNewMessage(appState, setAppState, socketConn)

    socketConn.on(SOCKET_EVENTS.CONNECT, onConnect)
    socketConn.on(SOCKET_EVENTS.DISCONNECT, onDisconnect)
    socketConn.on(SOCKET_EVENTS.CONNECT_ERROR, onConnectionError)

    // socketConn.on(SOCKET_EVENTS.S2C.SESSION, onReceiveSession)
    socketConn.on(SOCKET_EVENTS.S2C.USER_CONNECTED, onUserConnected)
    socketConn.on(SOCKET_EVENTS.S2C.USER_DISCONNECTED, onUserDisconnected)

    socketConn.on(SOCKET_EVENTS.S2C.CHALLENGES_STATUS, onChallengeStatusReceived)
    socketConn.on(SOCKET_EVENTS.S2C.NEW_CHAT_MESSAGE, onSomeonePostedNewMessage)

    return () => {
      socketConn.off(SOCKET_EVENTS.CONNECT, onConnect)
      socketConn.off(SOCKET_EVENTS.DISCONNECT, onDisconnect)
      socketConn.off(SOCKET_EVENTS.CONNECT_ERROR, onConnectionError)

      // socketConn.off(SOCKET_EVENTS.S2C.SESSION, onReceiveSession)
      socketConn.off(SOCKET_EVENTS.S2C.USER_CONNECTED, onUserConnected)
      socketConn.off(SOCKET_EVENTS.S2C.USER_DISCONNECTED, onUserDisconnected)

      socketConn.off(SOCKET_EVENTS.S2C.CHALLENGES_STATUS, onChallengeStatusReceived)
      socketConn.off(SOCKET_EVENTS.S2C.NEW_CHAT_MESSAGE, onSomeonePostedNewMessage)
    }
  }, [appState, socketConn, setAppState])

  return <WrappedComponent {...props} />
}