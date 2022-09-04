import styled, { keyframes } from 'styled-components'

/**
 * Transition between colors
 */
const colorSpectrumAnimation = keyframes`
  0% {
    // Blue
    background-color: rgb(49 131 188 / 50%);
  }
  100% {
    // Green
    background-color: rgb(49 188 77 / 50%);
  }
`

export const FloatingCard = styled.div.attrs({
  className: 'FloatingCard',
})`
  position: relative;
  width: 90%;
  height: 90%;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  background-color: #ead6a7;
  box-shadow: 2px 2px 9px #111111;
  max-width: 800px;
  z-index: 10;

  animation-name: ${colorSpectrumAnimation};
  animation-duration: 20s;
  animation-timing-function: ease-in;
  animation-iteration-count: infinite;
  animation-direction: alternate;
`
