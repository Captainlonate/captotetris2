import { useRef, useEffect } from 'react'
import styled from 'styled-components'
import GameLoop from '../../classes/GameLoop'
import TetrisGame from '../../classes/TetrisGame'

const GameContainer = styled.div`
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background-image: url('images/backgrounds/simple_plants.png');
  /* background-image: url('images/backgrounds/bird.png'); */
  /* background-image: url('images/backgrounds/fishbowl_4k.png'); */
  /* background-image: url('images/backgrounds/kitchen_4k.png'); */
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  overflow: hidden;
`

const InnerWrapper = styled.div`
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

const GameArea = styled.div`
  width: 90%;
  height: 90%;
  display: flex;
  justify-content: center;
  align-items: flex-start;
`

const StyledCanvas = styled.canvas`
  display: block;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  border: 5px solid #462a1a;
`

const CanvasAndFrameWrapper = styled.div`
  position: relative;
`

const TopPlank = styled.img`
  position: absolute; 
  top: -7%;
  left: -5%;
  width: 110%;
  height: 8%;
  z-index: 4;
  transform: rotate3d(1, 1, 1, -3deg);
`

const BottomPlank = styled.img`
  position: absolute; 
  bottom: -7%;
  left: -5%;
  width: 110%;
  height: 8%;
  z-index: 4;
  transform: rotate3d(1, 1, 1, -1deg);
`

const LeftPlank = styled.img`
  position: absolute; 
  bottom: -15%;
  left: -8%;
  width: 160%;
  height: 10%;
  z-index: 3;
  transform: rotate3d(0, 0, 1, -92deg);
  transform-origin: top left;
`

const RightPlank = styled.img`
  position: absolute; 
  bottom: -14%;
  right: -12%;
  width: 160%;
  height: 10%;
  z-index: 3;
  transform: rotate3d(0, 0, 1, 91deg);
  transform-origin: top right;
`

const TopPlankBehind = styled.img`
  position: absolute;
  top: -6%;
  left: -9%;
  width: 115%;
  height: 12%;
  z-index: -3;
  transform: rotate3d(1, 1, 1, -3deg);
`

const BottomPlankBehind = styled.img`
  position: absolute;
  bottom: -7%;
  left: -14%;
  width: 125%;
  height: 12%;
  z-index: -3;
  transform: rotate3d(0, 0, 1, 178deg);
`

const LeftPlankBehind = styled.img`
  position: absolute;
  top: -6%;
  left: 8%;
  width: 160%;
  height: 13%;
  z-index: -3;
  transform: rotate3d(0, 0, 1, 91deg);
  transform-origin: top left;
`

const RightPlankBehind = styled.img`
  position: absolute;
  bottom: -17%;
  right: -10%;
  width: 160%;
  height: 12%;
  z-index: -3;
  transform: rotate3d(0, 0, 1, 88deg);
  transform-origin: top right;
`

const FullScreenVideo = styled.video`
  object-fit: cover;
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
`

// const LeftWall = styled.div`
//   background-image: url('images/plank_frame.png');
//   position: absolute;
//   top: 0;
//   bottom: 0;
//   left: 0;
//   width: 15vw;
// `

const GameCanvas = () => {
  const canvasRef = useRef(null)
  const gameAreaRef = useRef(null)

  useEffect(() => {
    console.log('Mounting', Date.now())
    const gameLoop = new GameLoop(canvasRef, gameAreaRef)
    gameLoop.setGame(TetrisGame)
    gameLoop.start()

    return () => {
      console.warn('Unmounting!!!!!!!!', Date.now())
      gameLoop.stop()
    }
  }, [])

  return (
    <GameContainer>
      {/* <FullScreenVideo playsinline autoPlay muted loop>
        <source src='images/water_bg_mpeg4_h264.mp4' type='video/mp4' />
        Your browser does not support the video tag.
      </FullScreenVideo> */}
      <InnerWrapper>
        <GameArea ref={gameAreaRef}>
          <CanvasAndFrameWrapper>
            <StyledCanvas id='gameCanvas' ref={canvasRef} width='500px' height='500px' />

            <TopPlank src='images/plank_frame.png' />
            <BottomPlank src='images/plank_frame.png' />
            <LeftPlank src='images/plank_frame.png' />
            <RightPlank src='images/plank_frame.png' />

            <TopPlankBehind src='images/plank_frame_darker.png' />
            <BottomPlankBehind src='images/plank_frame_darker.png' />
            <LeftPlankBehind src='images/plank_frame_darker.png' />
            <RightPlankBehind src='images/plank_frame_darker.png' />
          </CanvasAndFrameWrapper>
        </GameArea>
      </InnerWrapper>
    </GameContainer>
  )
}

export default GameCanvas
