import { useState, useCallback } from 'react'

import { ChatInputBox, ChatInput, ChatSubmitBtn } from './styled'

// ==============================================

const ChatInputAndButton = ({ onSubmit }) => {
  const [chatMessage, setChatMessage] = useState('')

  const handleSubmit = useCallback(() => {
    if (chatMessage.trim().length > 0) {
      onSubmit(chatMessage)
      setChatMessage('')
    }
  }, [chatMessage, onSubmit])

  const handleKeyDown = useCallback(
    (e) => e?.key === 'Enter' && handleSubmit(),
    [handleSubmit]
  )

  return (
    <ChatInputBox>
      <ChatInput
        type="text"
        placeholder="Send a message"
        value={chatMessage}
        onChange={(e) => setChatMessage(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <ChatSubmitBtn onClick={handleSubmit}>Send</ChatSubmitBtn>
    </ChatInputBox>
  )
}

export default ChatInputAndButton
