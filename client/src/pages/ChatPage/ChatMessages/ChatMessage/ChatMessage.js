import {
  ChatMessageItem,
  ChatUserName,
  ChatMessageBubble,
  ChatMessageBubbleMessage,
  ChatMessageBubbleTime,
} from './styled'

// ==============================================

const ChatMessage = ({ userName, message, self, time }) => (
  <ChatMessageItem self={!!self}>
    <ChatUserName>{self ? 'Me' : userName}</ChatUserName>
    <ChatMessageBubble>
      <ChatMessageBubbleMessage>{message}</ChatMessageBubbleMessage>
      <ChatMessageBubbleTime>{time}</ChatMessageBubbleTime>
    </ChatMessageBubble>
  </ChatMessageItem>
)

export default ChatMessage
