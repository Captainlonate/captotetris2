import { BsChatDots } from 'react-icons/bs'
import { GiBattleGear, GiExitDoor } from 'react-icons/gi'
import { IoLogoGameControllerB } from 'react-icons/io'
import { FcAbout } from 'react-icons/fc'

import * as localStore from '../../../../../localStorage/localStorage'
import {
  SideBarWrapper,
  SideBarSquare,
  NotificationCircle,
  StyledSideBarLink,
} from './styled'
import { useAppContext } from '../../../../../context/AppContext'

// ==============================================

const applicationLogOut = () => {
  // Clear the user's active JWT
  localStore.clearJWT()
  // Completely reload the application and go to login
  window.location.href = '/'
}

// ==============================================

const SideBar = () => {
  const [appState] = useAppContext()

  const { notifications } = appState

  return (
    <SideBarWrapper>
      <StyledSideBarLink to="/chat">
        <SideBarSquare>
          <BsChatDots />
          <NotificationCircle show={notifications.haveUnreadChats} />
        </SideBarSquare>
      </StyledSideBarLink>
      <StyledSideBarLink to="/lobby">
        <SideBarSquare>
          <GiBattleGear />
          <NotificationCircle show={notifications.haveUnreadChallenges} />
        </SideBarSquare>
      </StyledSideBarLink>
      <StyledSideBarLink to="/play/alone">
        <SideBarSquare>
          <IoLogoGameControllerB />
        </SideBarSquare>
      </StyledSideBarLink>
      <StyledSideBarLink to="/about">
        <SideBarSquare>
          <FcAbout />
        </SideBarSquare>
      </StyledSideBarLink>
      <SideBarSquare variant="red" onClick={applicationLogOut} pushDown>
        <GiExitDoor />
      </SideBarSquare>
    </SideBarWrapper>
  )
}

export default SideBar
