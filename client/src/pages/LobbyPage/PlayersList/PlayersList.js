import { useEffect, useState } from 'react'

import { SOCKET_EVENTS } from '../../../network/socketio'
import { ACTION_TYPE, useAppContext } from '../../../context/AppContext'
import { useSocketContext } from '../../../context/SocketContext'

import { PlayerListContainer, PlayerListSectionHeader } from './styled'
import {
  categorizeListItems,
  createListItemsJSX,
  ACTION_INTENTS,
} from './utils'

// ==================================================

const PlayersList = () => {
  const [appState, setAppState] = useAppContext()
  const socketConn = useSocketContext()
  const [listItems, setListItems] = useState({
    // Challenges to you include both the user and the matchID
    challengesToYou: [],
    challengesByYou: [],
    usersCanBeChallenged: [],
    usersOffline: [],
  })

  /**
   * useEffect - Categorize users by:
   *  who challenge you, who you challenged, neither
   */
  useEffect(() => {
    const newListItems = categorizeListItems({
      allUsers:
        appState?.allUsers?.filter(
          (user) => user.userId !== appState.user.id
        ) ?? [],
      challengesToYou: appState?.challenges?.toYou ?? [],
      challengesFromYou: appState?.challenges?.fromYou ?? [],
    })
    setListItems(newListItems)
  }, [appState])

  /**
   * useEffect - Get the initial list of users
   */
  useEffect(() => {
    if (!appState.hasFetchedInitialUsers) {
      setAppState({ type: ACTION_TYPE.HAS_FETCHED_INITIAL_USERS })
      socketConn.emit(SOCKET_EVENTS.C2S.GET_ALL_USERS)
    }
  }, [socketConn, setAppState, appState.hasFetchedInitialUsers])

  /**
   * When a user clicks a button next to a player's name.
   * @param {*} intent Describes which button was clicked.
   * @param {{ otherUserId: string, matchID: string | null }}
   * @returns
   */
  const onTakeAction =
    (intent, { otherUserId, matchID }) =>
    (e) => {
      switch (intent) {
        case ACTION_INTENTS.CHALLENGE:
          socketConn.emit(SOCKET_EVENTS.C2S.CHALLENGE_TO, {
            challengee: otherUserId,
          })
          break
        case ACTION_INTENTS.ACCEPT_CHALLENGE:
          socketConn.emit(SOCKET_EVENTS.C2S.CHALLENGE_ACCEPT, {
            matchID,
          })
          break
        case ACTION_INTENTS.DECLINE_CHALLENGE:
          socketConn.emit(SOCKET_EVENTS.C2S.CHALLENGE_DECLINE, {
            matchID,
          })
          break
        default:
      }
    }

  const {
    challengesToYouJSX,
    challengesByYouJSX,
    usersCanBeChallengedJSX,
    offlineUsersJSX,
  } = createListItemsJSX(listItems, onTakeAction)

  return (
    <PlayerListContainer>
      {(challengesToYouJSX.length > 0 || challengesByYouJSX.length > 0) && (
        <PlayerListSectionHeader>Your Challenges</PlayerListSectionHeader>
      )}
      {challengesToYouJSX}
      {challengesByYouJSX}

      {usersCanBeChallengedJSX.length > 0 && (
        <PlayerListSectionHeader>Challenge Someone</PlayerListSectionHeader>
      )}
      {usersCanBeChallengedJSX}

      {offlineUsersJSX.length > 0 && (
        <PlayerListSectionHeader>Offline</PlayerListSectionHeader>
      )}
      {offlineUsersJSX}
    </PlayerListContainer>
  )
}

export default PlayersList
