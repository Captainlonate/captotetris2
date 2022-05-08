import { pipe } from 'ramda'

import Routes from '../Routes'
import { withAppContext } from '../../context/AppContext'
import { withSocketContext } from '../../context/SocketContext'
import { withLoadedLocalStorage } from './withLoadedLocalStorage'
import { withSocketListeners } from './withSocketListeners'
import { withHandleAppInit } from './withHandleAppInit'

// ===================================================

const App = () => <Routes />

// wrapped: inner first -> outer last
const AppWithProviders = pipe(
  withHandleAppInit,
  withSocketListeners,
  // withLoadedLocalStorage,
  withSocketContext,
  withAppContext,
)(App)

export default AppWithProviders
