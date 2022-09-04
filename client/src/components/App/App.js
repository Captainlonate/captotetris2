import { pipe } from 'ramda'
import { ThemeProvider } from 'styled-components'
import { BrowserRouter } from 'react-router-dom'

import Routes from '../Routes'
import { theme } from '../theme/theme'
import { withAppContext } from '../../context/AppContext'
import { withSocketContext } from '../../context/SocketContext'
import { withSocketListeners } from './withSocketListeners/index'
import { withHandleAppInit } from './withHandleAppInit'
import { GlobalStyles } from './globalStyles'
import { ToastContainer } from 'react-toastify'
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
  <BrowserRouter>
    <ThemeProvider theme={theme}>
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
    </ThemeProvider>
  </BrowserRouter>
)

export default AppWithGlobalStyles
