import { useRef, useEffect, useState } from 'react'

import GameLoop from '../logic/classes/GameLoop'
import TetrisGame from '../logic/classes/TetrisGame'
import checkIsMobile from '../../../utils/isMobile'
import Planks from '../Planks'
import BackgroundVideo from '../BackgroundVideo'
import bgVideoFile from '../videos/1000_40fps_medium_8-5MB.mp4'
import {
  GameContainer,
  InnerWrapper,
  GameArea,
  CanvasAndFrameWrapper,
  GameCanvas,
} from './styled'

// ==============================================

const EmbeddedGame = () => {
  // The game needs these to handle resizing
  const canvasRef = useRef(null)
  const gameAreaRef = useRef(null)
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

  return (
    <GameContainer>
      <InnerWrapper>
        <GameArea ref={gameAreaRef}>
          <CanvasAndFrameWrapper staticBG={true || isMobile}>
            <GameCanvas id="gameCanvas" ref={canvasRef} />
            {!isMobile && (
              <BackgroundVideo videoUrl={bgVideoFile} playbackSpeed={0.5} />
            )}
            <Planks />
          </CanvasAndFrameWrapper>
        </GameArea>
      </InnerWrapper>
    </GameContainer>
  )
}

export default EmbeddedGame
