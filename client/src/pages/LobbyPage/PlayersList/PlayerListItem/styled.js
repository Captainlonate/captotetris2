import styled from 'styled-components'

// =================Styled Components====================

export const StyledPlayerListItem = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 8px;
  border-bottom: 1px solid black;
`
StyledPlayerListItem.displayName = 'StyledPlayerListItem'

export const PlayerListItemUsername = styled.span`
  font-weight: bold;
`
PlayerListItemUsername.displayName = 'PlayerListItemUsername'

export const OnlineIndicatorText = styled.span`
  margin: 0 10px 0 15px;
  font-style: italic;
`
OnlineIndicatorText.displayName = 'OnlineIndicatorText'

export const OnlineIndicatorIcon = styled.div`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: ${({ isOnline }) => (isOnline ? '#69ca48' : 'grey')};
`
OnlineIndicatorIcon.displayName = 'OnlineIndicatorIcon'

export const ActionsContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
`
ActionsContainer.displayName = 'ActionsContainer'

const ButtonBase = styled.button`
  color: white;
  border: none;
  padding: 8px;
  border-radius: 5px;
  cursor: ${({ disabled }) => (!!disabled ? 'auto' : 'pointer')};
`
ButtonBase.displayName = 'ButtonBase'

export const ChallengeButton = styled(ButtonBase)`
  color: black;
  background-color: ${({ disabled }) => (!!disabled ? 'grey' : '#fff33d')};
  &:hover {
    background-color: ${({ disabled }) => (!!disabled ? 'grey' : '#f2e626')};
  }
  &:active {
    background-color: ${({ disabled }) => (!!disabled ? 'grey' : '#eea503')};
  }
`
ChallengeButton.displayName = 'ChallengeButton'

export const AcceptButton = styled(ButtonBase)`
  background-color: ${({ disabled }) => (!!disabled ? 'grey' : 'darkgreen')};
  &:hover {
    background-color: ${({ disabled }) => (!!disabled ? 'grey' : '#51bc2d')};
  }
  &:active {
    background-color: ${({ disabled }) => (!!disabled ? 'grey' : '#319e0d')};
  }
`
AcceptButton.displayName = 'AcceptButton'

export const DeclineButton = styled(ButtonBase)`
  background-color: ${({ disabled }) => (!!disabled ? 'grey' : 'red')};
  &:hover {
    background-color: ${({ disabled }) => (!!disabled ? 'grey' : '#51bc2d')};
  }
  &:active {
    background-color: ${({ disabled }) => (!!disabled ? 'grey' : '#319e0d')};
  }
`
DeclineButton.displayName = 'DeclineButton'

export const PendingButton = styled(ButtonBase).attrs({
  disabled: true,
})`
  background-color: blue;
  cursor: auto;
`
PendingButton.displayName = 'PendingButton'
