import styled from 'styled-components'
import { SideBarWrapper } from './SideBar/styled'
import { StatusBarWrapper } from './StatusBar/styled'

// ===============Styled Components==============

export const PageWithSideBarWrapper = styled.div.attrs({
  className: 'PageWithSideBar__Wrapper',
})`
  font-size: 16px;
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;

  ${SideBarWrapper} {
  }

  ${StatusBarWrapper} {
  }
`
PageWithSideBarWrapper.displayName = 'PageWithSideBarWrapper'

export const SideBarAndContent = styled.div.attrs({
  className: 'SideBarAndContent',
})`
  display: flex;
  flex-direction: row;
  flex: 1;
`
SideBarAndContent.displayName = 'SideBarAndContent'

export const PageWithSideBarContent = styled.div.attrs({
  className: 'PageWithSideBar__Content',
})`
  position: relative;
  flex: 1;
`
PageWithSideBarContent.displayName = 'PageWithSideBarContent'

export const PageWithSideBarStatusBar = styled.div.attrs({
  className: 'PageWithSideBar__StatusBar',
})`
  flex: 0 0 2.5em;
`
PageWithSideBarStatusBar.displayName = 'PageWithSideBarStatusBar'
