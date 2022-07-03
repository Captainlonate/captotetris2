import { useEffect, useState } from 'react'
import styled from 'styled-components'

import { SOCKET_EVENTS } from '../../../network/socketio'
import { useAppContext } from '../../../context/AppContext'
import { useSocketContext } from '../../../context/SocketContext'
import PlayerListItem from './PlayerListItem'

// =================Styled Components====================

const ListContainer = styled.div`
  display: flex;
  flex-direction: column;
  overflow: auto;
  flex: 1;
  border-right: 1px solid black;
`

const ListSectionHeader = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 22px;
  padding: 12px 4px;
`

// ====================Utilities=======================

const sortUsersByChallenge = ({
  allUsers,
  usersWhoChallengedYou,
  usersYouChallenged,
}) => {
  const users = {
    challengesToYou: [],
    challengesByYou: [],
    canBeChallenged: [],
    offline: []
  }

  allUsers.forEach((user) => {
    const userCpy = { ...user }
    if (!user?.connected) {
      users.offline.push(userCpy)
    } else if (usersWhoChallengedYou.includes(userCpy?.userID)) {
      users.challengesToYou.push(userCpy)
    } else if (usersYouChallenged.includes(userCpy?.userID)) {
      users.challengesByYou.push(userCpy)
    } else {
      users.canBeChallenged.push(userCpy)
    }
  })

  return users
}

const createListItemsJSX = ({ users, actionVariant, onTakeAction }) => (
  !Array.isArray(users)
    ? []
    : (
      users.map(({ userID, connected, userName } = {}) => (
        <PlayerListItem
          key={userID}
          userID={userID}
          isOnline={!!connected}
          userName={userName}
          actionVariant={actionVariant}
          onTakeAction={onTakeAction}
        />
      ))
    )
)

// ===============Constants & Types==================

export const ACTION_INTENTS = {
  CHALLENGE: 'CHALLENGE',
  ACCEPT_CHALLENGE: 'ACCEPT_CHALLENGE',
  DECLINE_CHALLENGE: 'DECLINE_CHALLENGE',
}

export const ACTION_VARIANTS = {
  DECIDING: 'DECIDING',
  PENDING: 'PENDING',
  CAN_CHALLENGE: 'CAN_CHALLENGE',
  OFFLINE: 'OFFLINE',
}

// ==================================================

const PlayersList = () => {
  const [appState] = useAppContext()
  const socketConn = useSocketContext()
  const [users, setUsers] = useState({
    challengesToYou: [],
    challengesByYou: [],
    canBeChallenged: [],
    offline: []
  })

  useEffect(() => {
    const users = sortUsersByChallenge({
      allUsers: appState?.allUsers?.filter((user) => user.userID !== appState.socketUserID) ?? [],
      usersWhoChallengedYou: appState?.usersWhoChallengedYou ?? [],
      usersYouChallenged: appState?.usersYouChallenged ?? [],
    })
    setUsers(users)
  }, [appState])

  const onTakeAction = (intent, otherUserID) => (e) => {
    if (intent === ACTION_INTENTS.CHALLENGE) {
      socketConn.emit(SOCKET_EVENTS.C2S.CHALLENGE, otherUserID)
    } else if (intent === ACTION_INTENTS.ACCEPT_CHALLENGE) {
      socketConn.emit(SOCKET_EVENTS.C2S.ACCEPT_CHALLENGE, otherUserID)
    } else if (intent === ACTION_INTENTS.DECLINE_CHALLENGE) {
      socketConn.emit(SOCKET_EVENTS.C2S.DECLINE_CHALLENGE, otherUserID)
    }
  }

  const playersChallengingYou = createListItemsJSX({
    users: users?.challengesToYou,
    onTakeAction,
    actionVariant: ACTION_VARIANTS.DECIDING
  })

  const playersYouChallenged = createListItemsJSX({
    users: users?.challengesByYou,
    onTakeAction,
    actionVariant: ACTION_VARIANTS.PENDING
  })

  const playersYouCanChallenge = createListItemsJSX({
    users: users?.canBeChallenged,
    onTakeAction,
    actionVariant: ACTION_VARIANTS.CAN_CHALLENGE
  })

  const offlinePlayers = createListItemsJSX({
    users: users?.offline,
    onTakeAction,
    actionVariant: ACTION_VARIANTS.OFFLINE
  })

  return (
    <ListContainer>
      {playersChallengingYou.length > 0 && <ListSectionHeader>Your Challenges</ListSectionHeader>}
      {playersChallengingYou}
      {playersYouChallenged}
      {playersYouCanChallenge.length > 0 && <ListSectionHeader>Challenge Someone</ListSectionHeader>}
      {playersYouCanChallenge}
      {offlinePlayers.length > 0 && <ListSectionHeader>Offline</ListSectionHeader>}
      {offlinePlayers}
    </ListContainer>
  )
}

export default PlayersList
