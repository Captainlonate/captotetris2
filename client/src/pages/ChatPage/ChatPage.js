import { ChatPageContent } from './styled'
import FilledContentWithRain from '../../components/Common/Layout/FilledContentWithRain'

const ChatPageContents = () => {
  return <ChatPageContent>Chat Page</ChatPageContent>
}

const ChatPage = () => (
  <FilledContentWithRain>
    <ChatPageContents />
  </FilledContentWithRain>
)

export default ChatPage
