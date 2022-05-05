import styled from 'styled-components'

const PageWrapper = styled.div`
  background-color: #292d33;
  width: 100vw;
  height: 100vh;
  color: white;
  font-size: 4em;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`

const LoadingPage = ({ text }) => (
  <PageWrapper>{text}</PageWrapper>
)

export default LoadingPage
