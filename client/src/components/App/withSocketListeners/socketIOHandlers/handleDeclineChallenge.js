import { toast } from 'react-toastify'
import { reject, propEq } from 'ramda'

import { ACTION_TYPE } from '../../../../context/AppContext'

// ===================================================

/**
 * A challenge was declined. You might even be the one
 * who declined it.
 */
export const handleDeclineChallenge =
  (appState, setAppState) =>
  (challengePayload = {}) => {
    const { matchID } = challengePayload ?? {}

    if (matchID) {
      // Current (previous) State
      const { toYou = [], fromYou = [] } = appState?.challenges ?? {}

      // Updated State to be set
      const updatedChallengeState = {
        toYou: reject(propEq('matchID', matchID))(toYou),
        fromYou: reject(propEq('matchID', matchID))(fromYou),
      }

      setAppState({
        type: ACTION_TYPE.SET_CHALLENGES,
        payload: updatedChallengeState,
      })

      // Show a notification that someone declined your challenge.
      const declinedMatch = fromYou.find(propEq('matchID', matchID))

      if (declinedMatch) {
        const personIdWhoDeclined = declinedMatch?.userID

        const userWhoDeclinedYou = appState?.allUsers.find(
          propEq('userId', personIdWhoDeclined)
        )
        if (userWhoDeclinedYou) {
          toast(`${userWhoDeclinedYou.userName} declined your match.`)
        }
      }
    }
  }
