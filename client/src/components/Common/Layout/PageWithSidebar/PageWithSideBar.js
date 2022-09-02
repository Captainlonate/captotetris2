import { Outlet } from 'react-router-dom'
import SideBar from './SideBar/SideBar'
import StatusBar from './StatusBar/StatusBar'
import {
  PageWithSideBarWrapper,
  SideBarAndContent,
  PageWithSideBarContent,
  PageWithSideBarStatusBar,
} from './styled'

export const PageWithSideBarLayout = () => (
  <PageWithSideBarWrapper>
    <SideBarAndContent>
      <SideBar />
      <PageWithSideBarContent>
        <Outlet />
      </PageWithSideBarContent>
    </SideBarAndContent>
    <PageWithSideBarStatusBar>
      <StatusBar />
    </PageWithSideBarStatusBar>
  </PageWithSideBarWrapper>
)

const PageWithSideBar = ({ children }) => {
  return (
    <PageWithSideBarWrapper>
      <SideBarAndContent>
        <SideBar />
        <PageWithSideBarContent>{children}</PageWithSideBarContent>
      </SideBarAndContent>
      <PageWithSideBarStatusBar>
        <StatusBar />
      </PageWithSideBarStatusBar>
    </PageWithSideBarWrapper>
  )
}

export default PageWithSideBar
