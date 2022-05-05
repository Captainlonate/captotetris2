import { useEffect } from 'react'

import LoadingPage from '../LoadingPage'
import { getSocketSession } from '../../localStorage/localStorage'
import { useAppContext } from '../../context/AppContext'

// ===================================================

export const withLoadedLocalStorage = (WrappedComponent) => (props) => {
  const [appState, setAppState] = useAppContext()

  useEffect(() => {
    const { sessionID, userID, userName } = getSocketSession()
    if ([sessionID, userID, userName].every((val) => !!val)) {
      setAppState({ type: 'SET_SOCKET_SESSION', payload: { sessionID, userID, userName } })
    }
  }, [setAppState])
  
  return (
    appState?.hasCheckedLocalStorageForSession
      ? <WrappedComponent {...props} />
      : <LoadingPage />
  )
}