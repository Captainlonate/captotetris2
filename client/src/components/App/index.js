import { pipe } from 'ramda'

import Routes from '../Routes'
import { withAppContext } from '../../context/AppContext'
import { withSocketContext } from '../../context/SocketContext'
import { withSocketListeners } from './withSocketListeners/index'
import { withHandleAppInit } from './withHandleAppInit'
import { GlobalStyles } from './globalStyles'
import { ToastContainer } from 'react-toastify'
// import 'react-toastify/dist/ReactToastify.css'
import 'react-toastify/dist/ReactToastify.min.css'

// ==============================================

// wrapped: inner first -> outer last
const AppWithProviders = pipe(
  withHandleAppInit,
  withSocketListeners,
  withSocketContext,
  withAppContext
)(Routes)

const AppWithGlobalStyles = () => (
  <>
    <GlobalStyles />
    <ToastContainer
      position="top-left"
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
    />
    <AppWithProviders />
  </>
)

export default AppWithGlobalStyles
