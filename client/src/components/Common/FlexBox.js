import styled from 'styled-components'

// ===============Styled Components==============

export const FlexBox = styled.div.attrs({
  className: 'ComFlexBox',
})`
  position: relative;
  display: flex;
  flex: ${({ flex }) => flex ?? '1'};
  flex-direction: ${({ dir }) => dir ?? 'row'};
  justify-content: ${({ justify }) => justify ?? 'stretch'};
  align-items: ${({ align }) => align ?? 'normal'};
  overflow: hidden;
`
