import { pipe } from 'ramda'

import Routes from '../Routes'
import { withAppContext } from '../../context/AppContext'
import { withSocketContext } from '../../context/SocketContext'
import { withSocketListeners } from './withSocketListeners/index'
import { withHandleAppInit } from './withHandleAppInit'

// ===================================================

const App = () => <Routes />

// wrapped: inner first -> outer last
const AppWithProviders = pipe(
  withHandleAppInit,
  withSocketListeners,
  withSocketContext,
  withAppContext,
)(App)

export default AppWithProviders
