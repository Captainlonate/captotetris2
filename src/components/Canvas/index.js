import styled from 'styled-components'

const StyledCanvas = styled.canvas`
  width: 500px;
  height: 500px;
`

const GameCanvas = () => {
  return (
    <StyledCanvas id='game-canvas' width='500px' height='500px' />
  )
}

export default GameCanvas
