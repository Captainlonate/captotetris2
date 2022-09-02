import { LoginPageWrapper } from './styled'
import LoginForm from './LoginForm/LoginForm'
import RainBG from '../../components/Common/RainBG'
import { PageContent, PageBackground } from '../../components/Common/Page'

// ==============================================

const LoginPage = () => (
  <LoginPageWrapper>
    <PageContent flex fJustify="center" fAlign="center">
      <LoginForm />
    </PageContent>
    <PageBackground>
      <RainBG />
    </PageBackground>
  </LoginPageWrapper>
)

export default LoginPage
