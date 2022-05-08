import { useEffect } from 'react'

import LoadingPage from '../LoadingPage'
import { getSocketSession } from '../../localStorage/localStorage'
import { useAppContext } from '../../context/AppContext'

// ===================================================

export const withLoadedLocalStorage = (WrappedComponent) => (props) => {
  const [appState, setAppState] = useAppContext()

  useEffect(() => {
    // Read the web socket session info from local storage (from last session)
    // If this is a first visit, then there will not be session info yet
    const { sessionID, userID, userName } = getSocketSession()
    // And load the previous session info into the context
    if ([sessionID, userID, userName].every((val) => !!val)) {
      console.log("Read from localStorage", { sessionID, userID, userName })
      setAppState({ type: 'SET_SOCKET_SESSION', payload: { sessionID, userID, userName } })
    }
    setAppState({ type: 'SET_CHECKED_SOCKET_STORAGE', payload: true })
  }, [setAppState])
  
  return (
    appState?.hasCheckedLocalStorageForSession
      ? <WrappedComponent {...props} />
      : <LoadingPage />
  )
}