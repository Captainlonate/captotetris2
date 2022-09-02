import styled from 'styled-components'

import BGImage_stormy_sea from '../../assets/images/backgrounds/stormy_sea.png'
import { PageWrapper } from '../../components/Common/Page'

// ===============Styled Components==============

export const LoginPageWrapper = styled(PageWrapper).attrs({
  className: 'LoginPage__Wrapper',
})`
  background-color: black;
  background: rgba(0, 0, 0, 0.3) url(${BGImage_stormy_sea});
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center bottom;
  background-blend-mode: darken;
`
LoginPageWrapper.displayName = 'LoginPageWrapper'
