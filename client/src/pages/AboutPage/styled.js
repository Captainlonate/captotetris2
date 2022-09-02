import styled from 'styled-components'

// ===============Styled Components==============

export const AboutPageContent = styled.div.attrs({
  className: 'AboutPage__Content',
})`
  width: 90%;
  height: 85%;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  background-color: #ead6a7;
  box-shadow: 2px 2px 9px #111111;
  max-width: 800px;
  z-index: 10;
`
AboutPageContent.displayName = 'AboutPageContent'
