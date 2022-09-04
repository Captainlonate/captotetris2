import { pipe, reject, append, propEq } from 'ramda'

import { ACTION_TYPE } from '../../../../context/AppContext'

// ===================================================

/**
 * When you challenge another user
 */
export const handleYouChallengedAnother =
  (appState, setAppState) => (challengePayload) => {
    const { matchID, challengeeID } = challengePayload ?? {}

    if (matchID && challengeeID) {
      // Current (previous) State
      const { toYou = [], fromYou = [] } = appState?.challenges ?? {}

      setAppState({
        type: ACTION_TYPE.SET_CHALLENGES,
        payload: {
          toYou: [...toYou],
          fromYou: pipe(
            reject(propEq('userID', challengeeID)),
            append({ matchID, userID: challengeeID })
          )(fromYou),
        },
      })
    }
  }
