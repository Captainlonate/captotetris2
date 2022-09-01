import PlayerListItem from './PlayerListItem'

// ===================Utilities==================

/**
 * Categorize a bunch of users into buckets, such as,
 * who is online, who is offline, who have you challenged
 * and who has challenged you.
 */
export const sortUsersByChallenge = ({
  allUsers,
  usersWhoChallengedYou,
  usersYouChallenged,
}) => {
  const users = {
    challengesToYou: [],
    challengesByYou: [],
    canBeChallenged: [],
    offline: [],
  }

  allUsers.forEach((user) => {
    const userCpy = { ...user }
    if (!user?.online) {
      users.offline.push(userCpy)
    } else if (usersWhoChallengedYou.includes(userCpy?.userId)) {
      users.challengesToYou.push(userCpy)
    } else if (usersYouChallenged.includes(userCpy?.userId)) {
      users.challengesByYou.push(userCpy)
    } else {
      users.canBeChallenged.push(userCpy)
    }
  })

  return users
}

export const createListItemsJSX = ({ users, actionVariant, onTakeAction }) =>
  !Array.isArray(users)
    ? []
    : users.map(({ userId, online, userName } = {}) => (
        <PlayerListItem
          key={userId}
          userId={userId}
          isOnline={!!online}
          userName={userName}
          actionVariant={actionVariant}
          onTakeAction={onTakeAction}
        />
      ))

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
