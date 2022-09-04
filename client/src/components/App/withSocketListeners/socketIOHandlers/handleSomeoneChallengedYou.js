import { pipe, reject, append, propEq } from 'ramda'

import { ACTION_TYPE } from '../../../../context/AppContext'

// ===================================================

/**
 * When someone else challenges you
 */
export const handleSomeoneChallengedYou =
  (appState, setAppState) => (challengePayload) => {
    const { matchID, challengerID } = challengePayload ?? {}

    if (matchID && challengerID) {
      // Current (previous) State
      const { toYou = [], fromYou = [] } = appState?.challenges ?? {}

      // Updated State to be set
      const updatedChallengeState = {
        toYou: pipe(
          reject(propEq('userID', challengerID)),
          append({ matchID, userID: challengerID })
        )(toYou),
        fromYou: [...fromYou],
      }

      setAppState({
        type: ACTION_TYPE.SET_CHALLENGES,
        payload: updatedChallengeState,
      })
    }
  }
