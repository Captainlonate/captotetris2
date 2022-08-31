import {
  BrowserRouter as BRouter,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom'

import LobbyPage from '../../pages/LobbyPage/LobbyPage'
import LoginPage from '../../pages/LoginPage/LoginPage'
import GamePage from '../../pages/GamePage/GamePage'
import { useAppContext } from '../../context/AppContext'
import { APP_INIT_STATUS } from '../../context/AppContext/reducer'

// ==============================================

const AuthenticatedRoutes = () => {
  return (
    <BRouter>
      <Routes>
        <Route path="/play/alone" element={<GamePage />} />
        <Route path="/lobby" element={<LobbyPage />} />
        <Route path="*" element={<Navigate to="/lobby" replace />} />
      </Routes>
    </BRouter>
  )
}

const UnAuthenticatedRoutes = () => {
  return <LoginPage />
}

const RoutesComp = () => {
  const [appState] = useAppContext()

  return appState.appInitStatus ===
    APP_INIT_STATUS.AUTHENTICATED_WITH_SOCKET ? (
    <AuthenticatedRoutes />
  ) : (
    <UnAuthenticatedRoutes />
  )
}

export default RoutesComp
