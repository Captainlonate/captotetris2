import {
  ACTION_TYPE,
  normalizeUsersFromApiForCtx,
} from '../../../../context/AppContext'

// ===================================================

/*
  When you receive a list of all users (and if they are online)
*/
export const handleReceivedAllUsers =
  (appState, setAppState) =>
  (allUserObjects = []) => {
    const normalizedUsers = allUserObjects.map(normalizeUsersFromApiForCtx)
    setAppState({ type: ACTION_TYPE.SET_ALL_USERS, payload: normalizedUsers })
  }
