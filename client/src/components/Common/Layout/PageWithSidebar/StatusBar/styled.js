import styled from 'styled-components'

// ===============Styled Components==============

export const StatusBarWrapper = styled.div.attrs({
  className: 'StatusBar__Wrapper',
})`
  font-size: 1em;
  font-family: 'TradeWinds';
  height: 100%;
  color: white;
  background-color: #3183bc;
  display: flex;
  align-items: center;
  padding: 0 1em;
  box-sizing: border-box;

  justify-content: space-between;
`
StatusBarWrapper.displayName = 'StatusBarWrapper'

export const ConnectedStatus = styled.div.attrs({
  className: 'StatusBar__ConnectedStatus',
})`
  font-size: 1em;
  display: flex;
  flex-direction: row;
  align-items: center;
`
ConnectedStatus.displayName = 'ConnectedStatus'

export const LightIndicator = styled.div.attrs({
  className: 'StatusBar__LightCircle',
})`
  background-color: ${({ online }) => (online ? '#02be02' : 'grey')};
  border: 1px solid white;
  border-radius: 50%;
  width: 1em;
  height: 1em;
  margin-left: 1em;
`
LightIndicator.displayName = 'LightIndicator'

export const UserNameText = styled.span.attrs({
  className: 'StatusBar__UserName',
})`
  font-size: 1em;
  line-height: 1;
  font-family: 'TradeWinds';
  margin-right: 0.25em;
  color: white;
`
UserNameText.displayName = 'UserNameText'
