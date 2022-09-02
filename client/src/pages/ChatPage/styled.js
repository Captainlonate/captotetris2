import styled from 'styled-components'

// ===============Styled Components==============

export const ChatPageContent = styled.div.attrs({
  className: 'ChatPage__Content',
})`
  width: 90%;
  height: 85%;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  background-color: rgb(49 131 188 / 50%);
  color: white;
  box-shadow: 2px 2px 9px #111111;
  max-width: 800px;
  z-index: 10;
`
ChatPageContent.displayName = 'ChatPageContent'
