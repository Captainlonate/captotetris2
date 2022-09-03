import { memo, useEffect, useRef } from 'react'

import { ChatMessagesWrapper, ScrollToDiv, FadeDarkBorder } from './styled'
import { FlexBox } from '../../../components/Common'
import ChatMessage from './ChatMessage/ChatMessage'

// ==============================================

const ChatMessages = ({
  messages = [],
  loggedInUserName,
  markMessagesAsRead,
}) => {
  const scrollToDivRef = useRef()

  /**
   * useEffect - Scroll to last message
   */
  useEffect(() => {
    if (messages.length > 0) {
      // This seems to need some delay to give *something else* time
      // to update the DOM. Without this, the first run (on page load)
      // doesn't quite go to the bottom.
      setTimeout(() => {
        scrollToDivRef.current.scrollIntoView({ behavior: 'smooth' })
      }, 150)
      //
      markMessagesAsRead && markMessagesAsRead()
    }
  }, [markMessagesAsRead, messages])

  return (
    <FlexBox>
      <FadeDarkBorder />
      <ChatMessagesWrapper>
        {messages?.map(({ id, author, message, createdAt }) => (
          <ChatMessage
            key={id}
            userName={author}
            message={message}
            time={createdAt}
            self={loggedInUserName === author}
          />
        ))}
        {/* This div is used for scrolling to the bottom */}
        <ScrollToDiv ref={scrollToDivRef} />
      </ChatMessagesWrapper>
    </FlexBox>
  )
}

export default memo(ChatMessages)
