import { useEffect, useState } from 'react'
import styled from 'styled-components'

import { SOCKET_EVENTS } from '../../../network/socketio'
import { useAppContext } from '../../../context/AppContext'
import { useSocketContext } from '../../../context/SocketContext'
import { ACTION_TYPE } from '../../../context/AppContext/reducer'
import {
  sortUsersByChallenge,
  createListItemsJSX,
  ACTION_INTENTS,
  ACTION_VARIANTS,
} from './utils'

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

// ==================================================
// ==================================================
// ==================================================

const PlayersList = () => {
  const [appState, setAppState] = useAppContext()
  const socketConn = useSocketContext()
  const [users, setUsers] = useState({
    challengesToYou: [],
    challengesByYou: [],
    canBeChallenged: [],
    offline: [],
  })

  useEffect(() => {
    const users = sortUsersByChallenge({
      allUsers:
        appState?.allUsers?.filter(
          (user) => user.userId !== appState.user.id
        ) ?? [],
      usersWhoChallengedYou: appState?.usersWhoChallengedYou ?? [],
      usersYouChallenged: appState?.usersYouChallenged ?? [],
    })
    setUsers(users)
  }, [appState])

  useEffect(() => {
    if (!appState.hasFetchedInitialUsers) {
      setAppState({ type: ACTION_TYPE.HAS_FETCHED_INITIAL_USERS })
      socketConn.emit(SOCKET_EVENTS.C2S.GET_ALL_USERS)
    }
  }, [socketConn, setAppState, appState.hasFetchedInitialUsers])

  const onTakeAction = (intent, otherUserId) => (e) => {
    if (intent === ACTION_INTENTS.CHALLENGE) {
      socketConn.emit(SOCKET_EVENTS.C2S.CHALLENGE, otherUserId)
    } else if (intent === ACTION_INTENTS.ACCEPT_CHALLENGE) {
      socketConn.emit(SOCKET_EVENTS.C2S.ACCEPT_CHALLENGE, otherUserId)
    } else if (intent === ACTION_INTENTS.DECLINE_CHALLENGE) {
      socketConn.emit(SOCKET_EVENTS.C2S.DECLINE_CHALLENGE, otherUserId)
    }
  }

  const playersChallengingYou = createListItemsJSX({
    users: users?.challengesToYou,
    onTakeAction,
    actionVariant: ACTION_VARIANTS.DECIDING,
  })

  const playersYouChallenged = createListItemsJSX({
    users: users?.challengesByYou,
    onTakeAction,
    actionVariant: ACTION_VARIANTS.PENDING,
  })

  const playersYouCanChallenge = createListItemsJSX({
    users: users?.canBeChallenged,
    onTakeAction,
    actionVariant: ACTION_VARIANTS.CAN_CHALLENGE,
  })

  const offlinePlayers = createListItemsJSX({
    users: users?.offline,
    onTakeAction,
    actionVariant: ACTION_VARIANTS.OFFLINE,
  })

  return (
    <ListContainer>
      {playersChallengingYou.length > 0 && (
        <ListSectionHeader>Your Challenges</ListSectionHeader>
      )}
      {playersChallengingYou}
      {playersYouChallenged}
      {playersYouCanChallenge.length > 0 && (
        <ListSectionHeader>Challenge Someone</ListSectionHeader>
      )}
      {playersYouCanChallenge}
      {offlinePlayers.length > 0 && (
        <ListSectionHeader>Offline</ListSectionHeader>
      )}
      {offlinePlayers}
    </ListContainer>
  )
}

export default PlayersList
