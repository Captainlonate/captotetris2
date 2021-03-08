import { useRef, useEffect } from 'react'
import styled from 'styled-components'
import GameLoop from '../../classes/GameLoop'
import TetrisGame from '../../classes/TetrisGame'

const GameArea = styled.div`
  background-color: green;
  width: 70vw;
  height: 80vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px;
  box-sizing: border-box;
  margin: 0 auto;
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
    <GameArea ref={gameAreaRef}>
      <StyledCanvas id='gameCanvas' ref={canvasRef} width='500px' height='500px' />
    </GameArea>
  )
}

export default GameCanvas
