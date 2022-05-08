import { useEffect } from 'react'

import LoadingPage from '../LoadingPage'
import { getSocketSession } from '../../localStorage/localStorage'
import { useAppContext } from '../../context/AppContext'
import { useSocketContext } from '../../context/SocketContext'

// ===================================================

export const withCheckIfLoggedIn = (WrappedComponent) => (props) => {
  const socketConn = useSocketContext()
  const [appState, setAppState] = useAppContext()

  useEffect(() => {
    // Check local storage

    //  if found something
    //    store in appcontext
    //    attempt to connect

    //  else if found nothing
    //    




    // When to show loading screen
    //  if (!notCheckedLocalStorage)
    //  if (haveCheckedLocalStorage && )

    // When to render routes
    //  if
    //    checkedLocalStorage && nothingInLocalStorage

    // When to show login page
    //  if
    //    checkedLocalStorage && nothingInLocalStorage



    // if (
    //   !appState.socketHasConnectedOnce &&
    //   !appState.socketTryingToConnect &&
    //   appState.hasSetSocketSession
    // ) {
    //   setAppState({ type: 'SET_SOCKET_PENDING_CONNECT', payload: true })
    //   socketConn.connect();
    // }
  }, [])
  
  return (
    appState?.hasCheckedLocalStorageForSession
      ? <WrappedComponent {...props} />
      : <LoadingPage />
  )
}