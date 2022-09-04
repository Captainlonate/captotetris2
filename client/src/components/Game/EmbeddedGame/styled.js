import styled from 'styled-components'

import { AbsoluteFill, DFlexCenter } from '../../Common'
import islandBackgroundImage from '../../../assets/images/backgrounds/simple_plants.png'
import plankFrameImage from '../../../assets/images/plank_frame.png'

// ===============Styled Components==============

export const GameContainer = styled.div.attrs({
  className: 'EmbeddedGame__Container',
})`
  ${AbsoluteFill}

  background-color: #4a2400;
  background-image: url(${plankFrameImage});
  background-position: top left;
  background-size: 50% 10%;

  z-index: 50;
`

export const InnerWrapper = styled.div.attrs({
  className: 'EmbeddedGame__Inner',
})`
  ${DFlexCenter}

  flex-direction: row;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding: 15px;
`

export const GameArea = styled.div.attrs({
  className: 'EmbeddedGame__GameArea',
})`
  width: 90%;
  height: 90%;
  display: flex;
  justify-content: center;
  align-items: flex-start;
`

export const GameCanvas = styled.canvas.attrs({
  className: 'EmbeddedGame__Canvas',
})`
  display: block;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  border: 5px solid #462a1a;
`

export const CanvasAndFrameWrapper = styled.div.attrs({
  className: 'EmbeddedGame__CanvasAndFrame',
})`
  position: relative;
  ${({ staticBG }) =>
    staticBG && 'background-image: url("' + islandBackgroundImage + '");'}
  ${({ staticBG }) => staticBG && 'background-position: left;'}
  ${({ staticBG }) => staticBG && 'background-size: cover;'}
  ${({ staticBG }) => staticBG && 'background-repeat: no-repeat;'}
`
