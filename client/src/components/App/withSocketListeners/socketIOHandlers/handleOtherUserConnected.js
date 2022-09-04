import { pipe, reject, append, sort, propEq } from 'ramda'

import {
  ACTION_TYPE,
  normalizeUsersFromApiForCtx,
} from '../../../../context/AppContext'

// ===================================================

const addOrUpdateUser = (updatedUser) =>
  pipe(
    reject(propEq('userId', updatedUser.userId)),
    append(updatedUser),
    sort((a, b) => a.userId - b.userId)
  )

// ===================================================

/*
  When someone else comes online
*/
export const handleOtherUserConnected =
  (appState, setAppState) => (connectedUserObj) => {
    const normalizedUser = normalizeUsersFromApiForCtx(connectedUserObj)
    const updatedUsers = addOrUpdateUser(normalizedUser)(appState.allUsers)
    setAppState({ type: ACTION_TYPE.SET_ALL_USERS, payload: updatedUsers })
  }
