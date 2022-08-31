import { memo } from 'react'
import styled from 'styled-components'
import { useAppContext } from '../../context/AppContext'

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 16px;
  padding: .25em;
  position: fixed;
  top: 10px;
  right: 10px;
  background-color: white;
  border-radius: 5px;
`

const LightIndicator = styled.div`
  background-color: ${({ connected }) => connected ? '#02be02' : 'grey' };
  border: 1px solid white;
  border-radius: 50%;
  width: 1em;
  height: 1em;
`

const NetworkIndicator = () => {
  const [appState] = useAppContext()
  const loading = false

  return (
    <Wrapper>
      {
        !loading && <LightIndicator connected={appState?.socketIsCurrentlyConnected} />
      }
    </Wrapper>
  )
}

export default memo(NetworkIndicator)