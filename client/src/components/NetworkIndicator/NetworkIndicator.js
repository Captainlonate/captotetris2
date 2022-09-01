import { memo } from 'react'
import styled from 'styled-components'
import { useAppContext } from '../../context/AppContext'

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 16px;
  padding: 0.25em;
  position: fixed;
  top: 10px;
  right: 10px;
  background-color: white;
  border-radius: 5px;
`

const LightIndicator = styled.div`
  background-color: ${({ connected }) => (connected ? '#02be02' : 'grey')};
  border: 1px solid white;
  border-radius: 50%;
  width: 1em;
  height: 1em;
`

const UserNameText = styled.span`
  line-height: 1;
  font-size: 14px;
  font-family: 'TradeWinds';
  margin-right: 0.25em;
  color: ${({ connected }) => (connected ? '#02be02' : 'grey')};
`

// ==============================================

const NetworkIndicator = () => {
  const [appState] = useAppContext()
  const loading = false

  const connected = appState?.socketIsCurrentlyConnected

  return (
    <Wrapper>
      <UserNameText connected={connected}>
        {appState.user.userName}
      </UserNameText>
      {!loading && <LightIndicator connected={connected} />}
    </Wrapper>
  )
}

export default memo(NetworkIndicator)
