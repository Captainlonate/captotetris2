import { useRef, useEffect, useState, memo, forwardRef } from 'react'

import GameLoop from '../logic/classes/GameLoop'
// import TetrisGame from '../logic/classes/TetrisGame'
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
import { MATCH_STATE, useAppContext } from '../../../context/AppContext'
import GameConfirmationModal from './GameConfirmationModal'
import { useSocketContext } from '../../../context/SocketContext'

// ==============================================

const EmbeddedGame = ({ matchID }) => {
  //
  const socketConn = useSocketContext()

  // The game needs these to handle resizing
  const canvasRef = useRef(null)
  const gameAreaRef = useRef(null)
  //
  const gameStateRef = useRef(null)
  // If mobile, a background image is used. Otherwise, a background video
  const [isMobile] = useState(() => checkIsMobile())

  console.log('EmbeddedGame Rendered!!!')

  // This creates the game and runs it. (MUST only ever happen once!)
  useEffect(() => {
    console.log('Mounting', Date.now())
    const gameLoop = new GameLoop(canvasRef, gameAreaRef)

    // console.log('Initializing with two-player mode for testing.')
    // gameLoop.initializeTwoPlayer(socketConn, matchID)
    // gameLoop.setGame(TetrisGame)

    console.log('Initializing one-player')
    gameLoop.initializeOnePlayer()
    gameLoop.start()

    return () => {
      // When this unmounts, remove the window's event listeners
      console.warn('Unmounting!!!!!!!!', Date.now())
      // Unregister event listeners
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

const MemoizedGame = memo(EmbeddedGame)

const EmbeddedGameContainer = ({ twoPlayer = false }) => {
  const [appState] = useAppContext()

  const matchID = appState?.match?.matchID

  if (
    !twoPlayer ||
    (matchID && appState.match.status === MATCH_STATE.PLAYING)
  ) {
    return <MemoizedGame matchID={matchID} />
  } else {
    return (
      <GameContainer>
        <GameConfirmationModal />
      </GameContainer>
    )
  }
}

export default EmbeddedGameContainer
