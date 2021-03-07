import GameCanvas from './components/Canvas'
import styled from 'styled-components'

const CanvasWrapper = styled.div``

const App = () => {
  return (
    <CanvasWrapper>
      <GameCanvas />
    </CanvasWrapper>
  )
}

export default App
