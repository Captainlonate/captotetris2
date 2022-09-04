import { NavLink } from 'react-router-dom'
import styled from 'styled-components'

// ===============Styled Components==============

export const SideBarWrapper = styled.div.attrs({
  className: 'SideBar__Wrapper',
})`
  font-size: 1em;
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: stretch;
  width: 5em;
  background-color: ${({ theme }) => theme.colors?.sideBarBG};
  color: ${({ theme }) => theme.colors?.sideBarFont};
  padding: 0.75em 0.5em;
  box-sizing: border-box;
`
SideBarWrapper.displayName = 'SideBarWrapper'

export const Notifications = styled.div.attrs({
  className: 'SideBar__Notifications',
})`
  position: absolute;
  bottom: 0.3em;
  right: 0.3em;
  border-radius: 50%;
  width: 1em;
  height: 1em;

  color: white;
  background-color: red;

  & span {
    font-weight: bold;
    font-size: 1.3em;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }
`

export const NotificationCircle = ({ show = false }) =>
  show ? (
    <Notifications>
      <span>!</span>
    </Notifications>
  ) : null

export const SideBarSquare = styled.div.attrs({
  className: 'SideBar__Square',
})`
  position: relative;
  border-radius: 5px;
  padding: 0.7em 0.1em 0.5em;
  text-align: center;
  cursor: pointer;
  transition: background-color 0.25s ease;
  margin-top: ${({ pushDown }) => (pushDown ? 'auto' : '0')};
  margin-bottom: ${({ pushDown }) => (pushDown ? '0' : '1.25em')};
  color: ${({ theme, variant }) =>
    variant === 'red'
      ? theme.colors.sideBarExitIcon
      : theme.colors.sideBarIcon};

  &:hover {
    background-color: ${({ theme }) => theme.colors.sideBarHoverIcon};
  }

  svg {
    font-size: 3em;
  }
`
SideBarSquare.displayName = 'SideBarSquare'

export const StyledSideBarLink = styled(NavLink)`
  &.active {
    color: ${({ theme }) => theme.colors.sideBarActiveIcon};
    ${SideBarSquare} {
      color: ${({ theme }) => theme.colors.sideBarActiveIcon};
      path {
        fill: ${({ theme }) => theme.colors.sideBarActiveIcon};
      }
    }
  }
`
StyledSideBarLink.displayName = 'StyledSideBarLink'
