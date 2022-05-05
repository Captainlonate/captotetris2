// import { useContext, useEffect } from 'react'
import { pipe } from 'ramda'

import Routes from '../Routes'
import { withAppContext } from '../../context/AppContext'
import { withSocketContext } from '../../context/SocketContext'
import { withLoadedLocalStorage } from './withLoadedLocalStorage'
import { withSocketListeners } from './withSocketListeners'

// ===================================================

const App = () => <Routes />

const AppWithProviders = pipe(
  withSocketListeners,
  withLoadedLocalStorage,
  withSocketContext,
  withAppContext,
)(App)

export default AppWithProviders
