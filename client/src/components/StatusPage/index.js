import { PageWrapper, BigText, DetailsText } from './styled'

// ==============================================

const StatusPage = ({ mainText, detailsText, cta }) => (
  <PageWrapper>
    <BigText>{mainText}</BigText>
    <DetailsText>{detailsText}</DetailsText>
    {cta}
  </PageWrapper>
)

export default StatusPage
