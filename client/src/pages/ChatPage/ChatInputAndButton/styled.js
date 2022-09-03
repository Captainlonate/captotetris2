import styled from 'styled-components'

// ===============Styled Components==============

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

/**
 *
 */
export const ChatSubmitBtn = styled.button.attrs({
  className: 'Chat__SubmitBtn',
})`
  background-color: wheat;
  border: none;
  margin-left: 10px;
  border-radius: 5px;
  font-size: 18px;
  padding: 6px 20px;
  cursor: pointer;
`
ChatSubmitBtn.displayName = 'ChatSubmitBtn'
