import styled from 'styled-components'

// ===============Styled Components==============

export const LobbyCardWrapper = styled.div.attrs({
  className: 'LobbyCard__Wrapper',
})`
  width: 90%;
  height: 85%;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  background-color: #ead6a7;
  box-shadow: 2px 2px 9px #111111;
  max-width: 800px;
  z-index: 10;
`
LobbyCardWrapper.displayName = 'LobbyCardWrapper'

export const MainArea = styled.div.attrs({
  className: 'LobbyCard__MainArea',
})`
  display: flex;
  flex-direction: column;
  overflow: auto;
  flex: 1;
  padding: 12px;
`
MainArea.displayName = 'MainArea'

export const TitleText = styled.h1`
  font-size: 42px;
  text-align: center;
  margin-top: 0;
  color: #489aca;
`
TitleText.displayName = 'TitleText'

export const SinglePlayerButton = styled.button`
  padding: 12px;
  border: none;
  border-radius: 5px;
  width: 100%;
  background-color: #a556ff;
  color: white;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
  letter-spacing: 1px;

  &:hover {
    background-color: #8b3ee2;
  }

  &:active {
    background-color: #6923b7;
  }
`
SinglePlayerButton.displayName = 'SinglePlayerButton'
