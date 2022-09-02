import { AboutPageContent } from './styled'
import FilledContentWithRain from '../../components/Common/Layout/FilledContentWithRain'

const AboutPageContents = () => {
  return <AboutPageContent>About Page</AboutPageContent>
}

const AboutPage = () => (
  <FilledContentWithRain>
    <AboutPageContents />
  </FilledContentWithRain>
)

export default AboutPage
