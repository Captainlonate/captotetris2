import { LoginPageWrapper } from './styled'
import LoginForm from './LoginForm/LoginForm'
import { RainBG, PageContent, PageBackground } from '../../components/Common'

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
