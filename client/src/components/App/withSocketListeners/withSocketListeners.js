import { useEffect } from 'react'

import { useSocketContext } from '../../../context/SocketContext'
import { useAppContext } from '../../../context/AppContext'
import { SocketHandlers } from './socketIOHandlers'

// ===================================================

export const withSocketListeners = (WrappedComponent) => (props) => {
  const socketConn = useSocketContext()
  const [appState, setAppState] = useAppContext()

  useEffect(() => {
    const handler = new SocketHandlers(appState, setAppState, socketConn)
    handler.register()

    return () => {
      handler.unRegister()
    }
  }, [appState, socketConn, setAppState])

  return <WrappedComponent {...props} />
}
