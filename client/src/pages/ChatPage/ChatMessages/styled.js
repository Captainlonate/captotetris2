import styled from 'styled-components'

// ===============Styled Components==============

/**
 *
 */
export const ChatMessagesWrapper = styled.div.attrs({
  className: 'Chat__MessagesWrapper',
})`
  position: relative;
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: auto;
  padding: 20px;
`
ChatMessagesWrapper.displayName = 'ChatMessagesWrapper'

/**
 *
 */
export const ScrollToDiv = styled.div.attrs({
  className: 'Chats__ScrollToDiv',
})`
  flex: 0 0 1px;
  position: relative;
`
ScrollToDiv.displayName = 'ScrollToDiv'

/**
 *
 */
export const FadeDarkBorder = styled.div.attrs({
  className: 'Chats__FadeDarkBorder',
})`
  position: absolute;
  height: 50px;
  width: 100%;
  top: 0;
  left: 0;
  overflow: hidden;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
  z-index: 1;
  background: linear-gradient(180deg, rgba(0, 0, 0, 0.7), transparent);
`
FadeDarkBorder.displayName = 'FadeDarkBorder'
