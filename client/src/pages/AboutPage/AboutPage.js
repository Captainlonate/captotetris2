// import { AboutPageContent } from './styled'
import { FloatingCard, FilledContentWithRain } from '../../components/Common'

// ==============================================

const AboutPageContents = () => {
  return <FloatingCard>About Page</FloatingCard>
}

const AboutPage = () => (
  <FilledContentWithRain>
    <AboutPageContents />
  </FilledContentWithRain>
)

export default AboutPage
