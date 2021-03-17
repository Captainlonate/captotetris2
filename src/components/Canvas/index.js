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
  background-image: url('images/simple_plants.png');
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
  width: 95%;
  height: 95%;
  display: flex;
  justify-content: center;
  align-items: flex-start;
`

const StyledCanvas = styled.canvas`
  display: block;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  border: 2px solid white;
`

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
          <StyledCanvas id='gameCanvas' ref={canvasRef} width='500px' height='500px' />
        </GameArea>
      </InnerWrapper>
    </GameContainer>
  )
}

export default GameCanvas
