import { SinglePlayerPageContent } from './styled'
import FilledContentWithRain from '../../components/Common/Layout/FilledContentWithRain'

const SinglePlayerPageContents = () => {
  return <SinglePlayerPageContent>SinglePlayer Page</SinglePlayerPageContent>
}

const SinglePlayerPage = () => (
  <FilledContentWithRain>
    <SinglePlayerPageContents />
  </FilledContentWithRain>
)

export default SinglePlayerPage
