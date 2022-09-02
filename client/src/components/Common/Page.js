import styled from 'styled-components'

// ===============Styled Components==============

export const PageWrapper = styled.div.attrs({
  className: 'Page__Wrapper',
})`
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  display: flex;
  box-sizing: border-box;

  & * {
    box-sizing: border-box;
  }
`

export const PageContent = styled.div.attrs({
  className: 'Page__Content',
})`
  z-index: 20;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;

  display: ${({ flex }) => (flex ? 'flex' : 'block')};
  ${({ fJustify }) => (fJustify ? `justify-content: ${fJustify};` : '')};
  ${({ fAlign }) => (fAlign ? `align-items: ${fAlign};` : '')};
`

export const PageBackground = styled.div.attrs({
  className: 'Page__Background',
})`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  display: flex;

  z-index: 1;
`
