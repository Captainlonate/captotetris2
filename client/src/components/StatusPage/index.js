import styled from 'styled-components'

const PageWrapper = styled.div`
  background-color: #292d33;
  width: 100vw;
  height: 100vh;
  color: white;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

const BigText = styled.div`
  font-size: 48px;
  color: white;
`

const DetailsText = styled.div`
  font-size: 32px;
  color: white;
`

const StatusPage = ({ mainText, detailsText, cta }) => (
  <PageWrapper>
    <BigText>{mainText}</BigText>
    <DetailsText>{detailsText}</DetailsText>
    {cta}
  </PageWrapper>
)

export default StatusPage