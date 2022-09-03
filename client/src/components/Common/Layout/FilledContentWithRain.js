import styled from 'styled-components'

import RainBG from '../RainBG'
import { AbsoluteFill } from '../CommonStyles'
import { PageContent, PageBackground } from '../Page'
import BGImage_stormy_sea from '../../../assets/images/backgrounds/stormy_sea.png'

// ============Styled Components=================

const FilledContentWrapper = styled.div.attrs({
  className: 'FilledContent__Wrapper',
})`
  ${AbsoluteFill}
  display: flex;

  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  z-index: 20;

  background: url(${BGImage_stormy_sea});
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center bottom;

  & * {
    box-sizing: border-box;
  }
`
FilledContentWrapper.displayName = 'FilledContentWrapper'

// ==============================================

const FilledContentWithRain = ({ children }) => (
  <FilledContentWrapper>
    <PageContent flex fJustify="center" fAlign="center">
      {children}
    </PageContent>
    <PageBackground>
      <RainBG />
    </PageBackground>
  </FilledContentWrapper>
)

export default FilledContentWithRain
