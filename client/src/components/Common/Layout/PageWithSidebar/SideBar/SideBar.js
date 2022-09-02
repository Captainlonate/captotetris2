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

// ==============================================

const applicationLogOut = () => {
  // Clear the user's active JWT
  localStore.clearJWT()
  // Completely reload the application and go to login
  window.location.href = '/'
}

// ==============================================

const SideBar = () => {
  return (
    <SideBarWrapper>
      <StyledSideBarLink to="/chat">
        <SideBarSquare>
          <BsChatDots />
        </SideBarSquare>
      </StyledSideBarLink>
      <StyledSideBarLink to="/lobby">
        <SideBarSquare active>
          <GiBattleGear />
          <NotificationCircle count={10} />
        </SideBarSquare>
      </StyledSideBarLink>
      <StyledSideBarLink to="/play/alone">
        <SideBarSquare>
          <IoLogoGameControllerB />
          <NotificationCircle count={2} />
        </SideBarSquare>
      </StyledSideBarLink>
      <StyledSideBarLink to="/about">
        <SideBarSquare>
          <FcAbout />
        </SideBarSquare>
      </StyledSideBarLink>
      <SideBarSquare onClick={applicationLogOut}>
        <GiExitDoor />
      </SideBarSquare>
    </SideBarWrapper>
  )
}

export default SideBar
