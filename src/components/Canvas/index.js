import { useRef, useEffect, useState } from 'react'
import GameLoop from '../../classes/GameLoop'
import TetrisGame from '../../classes/TetrisGame'
import checkIsMobile from '../../utils/isMobile'
import Planks from '../Planks'
import BackgroundVideo from '../BackgroundVideo'
import {
  GameContainer,
  InnerWrapper,
  GameArea,
  CanvasAndFrameWrapper,
  GameCanvas
} from './styled'

const backgroundVideoUrl = 'videos/1000_40fps_medium_8-5MB.mp4'

const Game = () => {
  // The game needs these to handle resizing
  const canvasRef = useRef(null)
  const gameAreaRef = useRef(null)
  // This is needed to set the playbackRate
  const videoRef = useRef(null)
  // If mobile, a background image is used. Otherwise, a background video
  const [isMobile] = useState(() => checkIsMobile())

  // This creates the game and runs it. (MUST only ever happen once!)
  useEffect(() => {
    console.log('Mounting', Date.now())
    const gameLoop = new GameLoop(canvasRef, gameAreaRef)
    gameLoop.setGame(TetrisGame)
    gameLoop.start()

    return () => {
      // When this unmounts, remove the window's event listeners
      console.warn('Unmounting!!!!!!!!', Date.now())
      gameLoop.stop()
    }
  }, [])

  useEffect(() => {
    // There is no attribute to adjust playback speed of
    // video tags, so it must be done in javascript.
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.5
    }
  }, [])

  return (
    <GameContainer>
      <InnerWrapper>
        <GameArea ref={gameAreaRef}>
          <CanvasAndFrameWrapper staticBG={isMobile}>
            <GameCanvas id='gameCanvas' ref={canvasRef} width='500px' height='500px' />
            {
              !isMobile && (<BackgroundVideo videoUrl={backgroundVideoUrl} />)
            }
            <Planks />
          </CanvasAndFrameWrapper>
        </GameArea>
      </InnerWrapper>
    </GameContainer>
  )
}

export default Game
