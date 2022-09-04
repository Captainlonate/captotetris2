import { reject, propEq } from 'ramda'

import { ACTION_TYPE } from '../../../../context/AppContext'

// ===================================================

const setUserOffline = (userId, allUsers) => {
  // create a new array and copy object references
  return allUsers.map((user) => ({
    ...user,
    online: userId === user.userId ? false : user.online,
  }))
}

// ===================================================

/*
  When someone else goes offline
*/
export const handleOtherUserDisconnected =
  (appState, setAppState) => (disconnectedUserID) => {
    // Update the disconnected user's status
    const updatedUsers = setUserOffline(disconnectedUserID, appState.allUsers)
    setAppState({ type: ACTION_TYPE.SET_ALL_USERS, payload: updatedUsers })

    // Remove any challenges to or from the disconnected user
    const { toYou = [], fromYou = [] } = appState?.challenges ?? {}

    setAppState({
      type: ACTION_TYPE.SET_CHALLENGES,
      payload: {
        toYou: reject(propEq('userID', disconnectedUserID))(toYou),
        fromYou: reject(propEq('userID', disconnectedUserID))(fromYou),
      },
    })
  }
