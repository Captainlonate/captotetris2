import {
  BrowserRouter as BRouter,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom'

import LobbyPage from '../../pages/LobbyPage/LobbyPage'
import LoginPage from '../../pages/LoginPage/LoginPage'
import GamePage from '../../pages/GamePage/GamePage'
import AboutPage from '../../pages/AboutPage/AboutPage'
import SinglePlayerPage from '../../pages/SinglePlayerPage/SinglePlayerPage'
import ChatPage from '../../pages/ChatPage/ChatPage'
import { useAppContext } from '../../context/AppContext'
import { APP_INIT_STATUS } from '../../context/AppContext/reducer'
import { PageWithSideBarLayout } from '../Common/Layout/PageWithSidebar/PageWithSideBar'

// ==============================================

const AuthenticatedRoutes = () => {
  return (
    <BRouter>
      <Routes>
        <Route element={<PageWithSideBarLayout />}>
          <Route path="/about" element={<AboutPage />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/play/alone" element={<SinglePlayerPage />} />
          <Route path="/lobby" element={<LobbyPage />} />
        </Route>
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
