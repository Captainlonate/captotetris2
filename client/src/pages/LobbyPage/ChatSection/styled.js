import styled from 'styled-components'

/**
 *
 */
export const ChatMessages = styled.div.attrs({
  className: 'Chat__Messages',
})`
  flex: 1;
  border-top: 1px solid black;
  border-bottom: 1px solid black;
  display: flex;
  flex-direction: column;
  overflow: auto;
  padding: 20px;
`
ChatMessages.displayName = 'ChatMessages'

/**
 *
 */
export const ChatUserName = styled.div.attrs({
  className: 'Chat__UserName',
})`
  font-weight: bold;
  flex: 0 0 auto;
  padding-top: 3px;
`
ChatUserName.displayName = 'ChatUserName'

/**
 *
 */
export const ChatMessageBubbleMessage = styled.div.attrs({
  className: 'Chat__MessageBubble__Message',
})`
  border-radius: 10px;
  padding: 5px 10px;
  background-color: #fff8e7;
`
ChatMessageBubbleMessage.displayName = 'ChatMessageBubbleMessage'

/**
 *
 */
export const ChatMessageBubbleTime = styled.div.attrs({
  className: 'Chat__MessageBubble__Time',
})`
  font-style: italic;
  font-size: 0.75em;
  padding: 0 1em;
`
ChatMessageBubbleTime.displayName = 'ChatMessageBubbleTime'

/**
 *
 */
export const ChatMessageBubble = styled.div.attrs({
  className: 'Chat__MessageBubble',
})`
  display: flex;
  flex-direction: column;
  font-size: 0.9em;
`
ChatMessageBubble.displayName = 'ChatMessageBubble'

/**
 *
 */
export const ChatMessageItem = styled.div.attrs({
  className: 'Chat__MessageItem',
})`
  flex: 1;
  display: flex;
  padding: 5px;
  align-items: start;
  flex-direction: ${({ self }) => (self ? 'row' : 'row-reverse')};
  ${ChatMessageBubble} {
    text-align: ${({ self }) => (self ? 'left' : 'right')};
  }
  ${ChatUserName} {
    margin: ${({ self }) => (self ? '0 10px 0 0' : '0 0 0 10px')};
    color: ${({ self }) => (self ? '#14bb44' : 'black')};
  }
`
ChatMessageItem.displayName = 'ChatMessageItem'

/**
 *
 */
export const ChatInputBox = styled.div.attrs({
  className: 'Chat__InputBox',
})`
  height: 50px;
  display: flex;
  align-items: center;
  padding: 10px;
`
ChatInputBox.displayName = 'ChatInputBox'

/**
 *
 */
export const ChatInput = styled.input.attrs({
  className: 'Chat__Input',
})`
  font-size: 18px;
  padding: 6px;
  border-radius: 5px;
  border: 0;
  flex: 1;
  display: block;
`
ChatInput.displayName = 'ChatInput'
