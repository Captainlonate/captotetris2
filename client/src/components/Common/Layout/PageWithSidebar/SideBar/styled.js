import { Link } from 'react-router-dom'
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
  background-color: #1c1f21;
  color: white;
  padding: 0.75em 0.5em;
  box-sizing: border-box;
`
SideBarWrapper.displayName = 'SideBarWrapper'

export const Notifications = styled.div.attrs({
  className: 'SideBar__Notifications',
})`
  position: absolute;
  bottom: 0.2em;
  right: 0.2em;
  border-radius: 50%;
  width: 1.25em;
  height: 1.25em;

  color: white;
  background-color: red;

  & span {
    font-weight: bold;
    font-size: 0.7em;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }
`

export const NotificationCircle = ({ count = 0 }) =>
  typeof count === 'number' && count > 0 ? (
    <Notifications>
      <span>{Math.min(99, count)}</span>
    </Notifications>
  ) : null

export const SideBarSquare = styled.div.attrs({
  className: 'SideBar__Square',
})`
  position: relative;
  border-radius: 5px;
  color: ${({ active }) => (active ? '#9eda55' : '#55a4da')};
  padding: 0.7em 0.1em 0.5em;
  text-align: center;
  margin-bottom: 1.25em;
  cursor: pointer;
  transition: background-color 0.25s ease;

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }

  svg {
    font-size: 3em;
  }
`
SideBarSquare.displayName = 'SideBarSquare'

export const StyledSideBarLink = styled(Link)``
StyledSideBarLink.displayName = 'StyledSideBarLink'
