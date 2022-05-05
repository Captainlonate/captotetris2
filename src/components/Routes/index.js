import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from "react-router-dom"
import LobbyPage from '../Lobby/Lobby'

const RoutesComp = () => {
  return (
    <Router>
      <Routes>
        {/* <Route path="/play/alone">
          <GamePage />
        </Route> */}
        <Route path="/lobby">
          <LobbyPage />
        </Route>
        <Navigate to='/lobby' />
      </Routes>
    </Router>
  )
}

export default RoutesComp
