import { useEffect } from 'react'

import { useSocketContext } from '../../context/SocketContext'
import { SOCKET_EVENTS } from '../../network/socketio'
import { useAppContext } from '../../context/AppContext'

// ===================================================

export const withSocketListeners = (WrappedComponent) => (props) => {
  const socketConn = useSocketContext()
  const [appState, setAppState] = useAppContext()
  console.log({ appState })

  useEffect(() => {
    socketConn.on(SOCKET_EVENTS.CONNECT, () => {
      console.log("Connected")
      setAppState({ type: 'SET_SOCKET_CONNECTED', payload: { isConnected: true } })
    })
    socketConn.on(SOCKET_EVENTS.DISCONNECT, () => {
      console.log("Disconnected")
      setAppState({ type: 'SET_SOCKET_CONNECTED', payload: { isConnected: false } })
    })
    socketConn.on(SOCKET_EVENTS.CONNECT_ERROR, () => {
      console.log("Connection Error")
      setAppState({ type: 'SET_SOCKET_CONNECTED', payload: { isConnected: false } })
    })
    socketConn.on(SOCKET_EVENTS.SESSION, (sessionInfo) => {
      console.log("Session Information Received", sessionInfo)
      setAppState({ type: 'SET_SOCKET_SESSION', payload: sessionInfo })
    })
    return () => {
      socketConn.off(SOCKET_EVENTS.CONNECT)
      socketConn.off(SOCKET_EVENTS.DISCONNECT)
      socketConn.off(SOCKET_EVENTS.CONNECT_ERROR)
      socketConn.off(SOCKET_EVENTS.SESSION)
    }
  }, [socketConn, setAppState])

  return <WrappedComponent {...props} />
}