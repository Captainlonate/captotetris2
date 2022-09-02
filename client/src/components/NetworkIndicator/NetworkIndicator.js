import { memo } from 'react'
import styled from 'styled-components'
import { useAppContext } from '../../context/AppContext'

const NetworkIndicatorWrapper = styled.div.attrs({
  className: 'NetworkIndicator',
})`
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
  z-index: 20;
`
NetworkIndicatorWrapper.displayName = 'NetworkIndicatorWrapper'

const LightIndicator = styled.div.attrs({
  className: 'NetworkIndicator__LightCircle',
})`
  background-color: ${({ connected }) => (connected ? '#02be02' : 'grey')};
  border: 1px solid white;
  border-radius: 50%;
  width: 1em;
  height: 1em;
`
LightIndicator.displayName = 'LightIndicator'

const UserNameText = styled.span.attrs({
  className: 'NetworkIndicator__UserName',
})`
  line-height: 1;
  font-size: 14px;
  font-family: 'TradeWinds';
  margin-right: 0.25em;
  color: ${({ connected }) => (connected ? '#02be02' : 'grey')};
`
UserNameText.displayName = 'UserNameText'

// ==============================================

const NetworkIndicator = () => {
  const [appState] = useAppContext()
  const loading = false

  const connected = appState?.socketIsCurrentlyConnected

  return (
    <NetworkIndicatorWrapper>
      <UserNameText connected={connected}>
        {appState.user.userName}
      </UserNameText>
      {!loading && <LightIndicator connected={connected} />}
    </NetworkIndicatorWrapper>
  )
}

export default memo(NetworkIndicator)
