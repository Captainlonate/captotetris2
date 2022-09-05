import { Outlet } from 'react-router-dom'
import SideBar from './SideBar/SideBar'
import StatusBar from './StatusBar/StatusBar'
import {
  PageWithSideBarWrapper,
  SideBarAndContent,
  PageWithSideBarContent,
  PageWithSideBarStatusBar,
} from './styled'

const PageWithSideBarOutlet = () => (
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

export default PageWithSideBarOutlet