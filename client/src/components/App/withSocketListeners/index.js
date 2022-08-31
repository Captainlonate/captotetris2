import { useEffect } from 'react'

import { useSocketContext } from '../../../context/SocketContext'
import { SOCKET_EVENTS } from '../../../network/socketio'
import { useAppContext } from '../../../context/AppContext'
import * as SockHandler from './SocketIOHandler'

// ===================================================

export const withSocketListeners = (WrappedComponent) => (props) => {
  const socketConn = useSocketContext()
  const [appState, setAppState] = useAppContext()

  useEffect(() => {
    // Create the handlers
    const onConnect = SockHandler.handleConnection(
      appState,
      setAppState,
      socketConn
    )
    const onDisconnect = SockHandler.handleDisconnect(
      appState,
      setAppState,
      socketConn
    )
    const onConnectionError = SockHandler.handleConnectionError(
      appState,
      setAppState,
      socketConn
    )
    const onUserConnected = SockHandler.handleOtherUserConnected(
      appState,
      setAppState,
      socketConn
    )
    const onUserDisconnected = SockHandler.handleOtherUserDisconnected(
      appState,
      setAppState,
      socketConn
    )
    const onChallengeStatusReceived = SockHandler.handleChallengeStatusUpdated(
      appState,
      setAppState,
      socketConn
    )
    const onSomeonePostedNewMessage = SockHandler.handleSomeonePostedNewMessage(
      appState,
      setAppState,
      socketConn
    )

    // Register the handlers
    socketConn.on(SOCKET_EVENTS.CONNECT, onConnect)
    socketConn.on(SOCKET_EVENTS.DISCONNECT, onDisconnect)
    socketConn.on(SOCKET_EVENTS.CONNECT_ERROR, onConnectionError)
    socketConn.on(SOCKET_EVENTS.S2C.USER_CONNECTED, onUserConnected)
    socketConn.on(SOCKET_EVENTS.S2C.USER_DISCONNECTED, onUserDisconnected)
    socketConn.on(
      SOCKET_EVENTS.S2C.CHALLENGES_STATUS,
      onChallengeStatusReceived
    )
    socketConn.on(SOCKET_EVENTS.S2C.NEW_CHAT_MESSAGE, onSomeonePostedNewMessage)

    return () => {
      // unregister the handlers
      socketConn.off(SOCKET_EVENTS.CONNECT, onConnect)
      socketConn.off(SOCKET_EVENTS.DISCONNECT, onDisconnect)
      socketConn.off(SOCKET_EVENTS.CONNECT_ERROR, onConnectionError)

      socketConn.off(SOCKET_EVENTS.S2C.USER_CONNECTED, onUserConnected)
      socketConn.off(SOCKET_EVENTS.S2C.USER_DISCONNECTED, onUserDisconnected)

      socketConn.off(
        SOCKET_EVENTS.S2C.CHALLENGES_STATUS,
        onChallengeStatusReceived
      )
      socketConn.off(
        SOCKET_EVENTS.S2C.NEW_CHAT_MESSAGE,
        onSomeonePostedNewMessage
      )
    }
  }, [appState, socketConn, setAppState])

  return <WrappedComponent {...props} />
}
