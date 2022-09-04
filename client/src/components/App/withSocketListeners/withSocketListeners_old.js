import { useEffect } from 'react'

import { useSocketContext } from '../../../context/SocketContext'
import { SOCKET_EVENTS } from '../../../network/socketio'
import { useAppContext } from '../../../context/AppContext'
import * as SockHandlers from './socketIOHandlers'

// ===================================================

export const withSocketListeners = (WrappedComponent) => (props) => {
  const socketConn = useSocketContext()
  const [appState, setAppState] = useAppContext()

  useEffect(() => {
    // Create the handlers
    const onConnect = SockHandlers.handleConnection(
      appState,
      setAppState,
      socketConn
    )
    const onDisconnect = SockHandlers.handleDisconnect(
      appState,
      setAppState,
      socketConn
    )
    const onConnectionError = SockHandlers.handleConnectionError(
      appState,
      setAppState,
      socketConn
    )
    const onReceivedAllUsers = SockHandlers.handleReceivedAllUsers(
      appState,
      setAppState,
      socketConn
    )
    const onUserConnected = SockHandlers.handleOtherUserConnected(
      appState,
      setAppState,
      socketConn
    )
    const onUserDisconnected = SockHandlers.handleOtherUserDisconnected(
      appState,
      setAppState,
      socketConn
    )
    const onYouChallengedAnother = SockHandlers.handleYouChallengedAnother(
      appState,
      setAppState,
      socketConn
    )
    const onSomeoneChallengedYou = SockHandlers.handleSomeoneChallengedYou(
      appState,
      setAppState,
      socketConn
    )
    const onChallengeDeclined = SockHandlers.handleDeclineChallenge(
      appState,
      setAppState,
      socketConn
    )
    const onSomeonePostedNewMessage =
      SockHandlers.handleSomeonePostedNewMessage(
        appState,
        setAppState,
        socketConn
      )

    // Register the handlers
    socketConn.on(SOCKET_EVENTS.CONNECT, onConnect)
    socketConn.on(SOCKET_EVENTS.DISCONNECT, onDisconnect)
    socketConn.on(SOCKET_EVENTS.CONNECT_ERROR, onConnectionError)
    socketConn.on(SOCKET_EVENTS.S2C.ALL_USERS, onReceivedAllUsers)
    socketConn.on(SOCKET_EVENTS.S2C.USER_CONNECTED, onUserConnected)
    socketConn.on(SOCKET_EVENTS.S2C.USER_DISCONNECTED, onUserDisconnected)

    socketConn.on(
      SOCKET_EVENTS.S2C.YOU_CHALLENGED_ANOTHER,
      onYouChallengedAnother
    )
    socketConn.on(
      SOCKET_EVENTS.S2C.SOMEONE_CHALLENGED_YOU,
      onSomeoneChallengedYou
    )
    socketConn.on(SOCKET_EVENTS.S2C.DECLINED_CHALLENGE, onChallengeDeclined)
    socketConn.on(SOCKET_EVENTS.S2C.NEW_CHAT_MESSAGE, onSomeonePostedNewMessage)

    return () => {
      // unregister the handlers
      socketConn.off(SOCKET_EVENTS.CONNECT, onConnect)
      socketConn.off(SOCKET_EVENTS.DISCONNECT, onDisconnect)
      socketConn.off(SOCKET_EVENTS.CONNECT_ERROR, onConnectionError)

      socketConn.off(SOCKET_EVENTS.S2C.ALL_USERS, onReceivedAllUsers)
      socketConn.off(SOCKET_EVENTS.S2C.USER_CONNECTED, onUserConnected)
      socketConn.off(SOCKET_EVENTS.S2C.USER_DISCONNECTED, onUserDisconnected)

      socketConn.off(
        SOCKET_EVENTS.S2C.YOU_CHALLENGED_ANOTHER,
        onYouChallengedAnother
      )
      socketConn.off(
        SOCKET_EVENTS.S2C.SOMEONE_CHALLENGED_YOU,
        onSomeoneChallengedYou
      )
      socketConn.off(SOCKET_EVENTS.S2C.DECLINED_CHALLENGE, onChallengeDeclined)
      socketConn.off(
        SOCKET_EVENTS.S2C.NEW_CHAT_MESSAGE,
        onSomeonePostedNewMessage
      )
    }
  }, [appState, socketConn, setAppState])

  return <WrappedComponent {...props} />
}
