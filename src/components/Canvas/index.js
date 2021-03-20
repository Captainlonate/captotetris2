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
  /* background-image: url('images/backgrounds/simple_plants.png'); */
  /* background-image: url('images/backgrounds/bird.png'); */
  /* background-image: url('images/backgrounds/fishbowl_4k.png'); */
  background-image: url('images/backgrounds/kitchen_4k.png');
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
  /* border: 30px solid blue;
  border-image: url('images/canvas_frame.png');
  border-image-slice: 33%;
  border-image-width: 1;
  border-image-outset: 0;
  border-image-repeat: stretch; */
`

const CanvasAndFrameWrapper = styled.div`
  position: relative;
`

const Planks = styled.div`
  position: relative;
`

const TopPlank = styled.img`
  position: absolute; 
  top: -7%;
  left: -5%;
  width: 110%;
  height: 8%;
  z-index: 3;
  transform: rotate3d(1, 1, 1, 2deg);
`

const BottomPlank = styled.img`
  position: absolute; 
  bottom: -7%;
  left: -5%;
  width: 110%;
  height: 8%;
  z-index: 3;
  transform: rotate3d(1, 1, 1, -1deg);
`

const LeftPlank = styled.img`
  position: absolute; 
  top: -6%;
  left: 2%;
  width: 160%;
  height: 10%;
  z-index: 3;
  transform: rotate3d(0, 0, 1, 90deg);
  transform-origin: top left;
`

const RightPlank = styled.img`
  position: absolute; 
  top: -6%;
  right: 1%;
  width: 160%;
  height: 10%;
  z-index: 3;
  transform: rotate3d(0, 0, 1, -90deg);
  transform-origin: top right;
`

// const CanvasFrame = styled.div`
//   position: absolute;
//   background-image: url('images/canvas_frame.png');
//   background-repeat: no-repeat;
//   background-size: contain;
//   background-position: center;

//   top: -20%;
//   left: -20%;
//   width: 100%;
//   height: 100%;

//   z-index: -1;
// `

// const CanvasFrame = styled.img`
//   position: absolute;
//   top: 0;
//   left: 0;
//   width: 0;
//   height: 0;

//   z-index: -1;
// `

// const CanvasFrame = styled.div`
//   position: absolute;
//   background-image: url('images/canvas_frame.png');
//   background-repeat: no-repeat;;
//   top: 0;
//   left: 0;

//   z-index: -1;
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
      <InnerWrapper>
        <GameArea ref={gameAreaRef}>
          <CanvasAndFrameWrapper>
            <StyledCanvas id='gameCanvas' ref={canvasRef} width='500px' height='500px' />
            <TopPlank src='images/TopPlank.png' />
            <BottomPlank src='images/TopPlank.png' />
            <LeftPlank src='images/TopPlank.png' />
            <RightPlank src='images/TopPlank.png' />
          </CanvasAndFrameWrapper>
        </GameArea>
      </InnerWrapper>
    </GameContainer>
  )
}

export default GameCanvas
