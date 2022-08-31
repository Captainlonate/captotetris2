import styled from 'styled-components'
import islandBackgroundImage from '../../assets/images/backgrounds/simple_plants.png'
import plankFrameImage from '../../assets/images/plank_frame.png'

export const GameContainer = styled.div`
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  overflow: hidden;
  background-color: #4a2400;
  background-image: url(${plankFrameImage});
  background-position: top left;
  background-size: 50% 10%;
`

export const InnerWrapper = styled.div`
  display: block;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding: 15px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`

export const GameArea = styled.div`
  width: 90%;
  height: 90%;
  display: flex;
  justify-content: center;
  align-items: flex-start;
`

export const GameCanvas = styled.canvas`
  display: block;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  border: 5px solid #462a1a;
`

export const CanvasAndFrameWrapper = styled.div`
  position: relative;
  ${({ staticBG }) =>
    staticBG && 'background-image: url("' + islandBackgroundImage + '");'}
  ${({ staticBG }) => staticBG && 'background-position: left;'}
  ${({ staticBG }) => staticBG && 'background-size: cover;'}
  ${({ staticBG }) => staticBG && 'background-repeat: no-repeat;'}
`
