import { map, propEq, curry, find } from 'ramda'

import PlayerListItem from './PlayerListItem/PlayerListItem'

// ===================Utilities==================

/**
 * Categorize a bunch of users into buckets, such as,
 * who is online, who is offline, who have you challenged
 * and who has challenged you.
 */
export const categorizeListItems = ({
  allUsers,
  challengesToYou,
  challengesFromYou,
}) => {
  const listItems = {
    challengesToYou: [],
    challengesByYou: [],
    usersCanBeChallenged: [],
    usersOffline: [],
  }

  allUsers.forEach((user) => {
    const userCpy = { ...user }
    const findById = find(propEq('userID', user?.userId))
    const challengeToYou = findById(challengesToYou)
    const challengeByYou = findById(challengesFromYou)

    if (!user?.online) {
      listItems.usersOffline.push({ user: userCpy, matchID: null })
    } else if (challengeToYou) {
      listItems.challengesToYou.push({
        user: userCpy,
        matchID: challengeToYou.matchID,
      })
    } else if (challengeByYou) {
      listItems.challengesByYou.push({
        user: userCpy,
        matchID: challengeByYou.matchID,
      })
    } else {
      listItems.usersCanBeChallenged.push({ user: userCpy, matchID: null })
    }
  })

  return listItems
}

const makePlayerListItem = curry(
  (onTakeAction, actionVariant, { user, matchID }) => (
    <PlayerListItem
      key={user?.userId}
      userId={user?.userId}
      isOnline={!!user?.online}
      userName={user?.userName}
      actionVariant={actionVariant}
      onTakeAction={onTakeAction}
      matchID={matchID}
    />
  )
)

export const createListItemsJSX = (
  {
    challengesToYou = [],
    challengesByYou = [],
    usersCanBeChallenged = [],
    usersOffline = [],
  },
  onTakeAction
) => {
  const makeListItem = makePlayerListItem(onTakeAction)

  const makeToYou = map(makeListItem(ACTION_VARIANTS.DECIDING))
  const makeByYou = map(makeListItem(ACTION_VARIANTS.PENDING))
  const makeCanBe = map(makeListItem(ACTION_VARIANTS.CAN_CHALLENGE))
  const makeOffline = map(makeListItem(ACTION_VARIANTS.OFFLINE))

  return {
    challengesToYouJSX: makeToYou(challengesToYou),
    challengesByYouJSX: makeByYou(challengesByYou),
    usersCanBeChallengedJSX: makeCanBe(usersCanBeChallenged),
    offlineUsersJSX: makeOffline(usersOffline),
  }
}

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
