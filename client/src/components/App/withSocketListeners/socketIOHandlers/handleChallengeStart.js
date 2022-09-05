import { reject, propEq } from 'ramda'

import { ACTION_TYPE } from '../../../../context/AppContext'

// ===================================================

/**
 * When both players have accepted the challenge, and
 * it's time to show the game screen and the confirmation
 * dialog.
 */
export const handleChallengeStart = (appState, setAppState) => (payload) => {
  const { matchID, challenger, challengee } = payload ?? {}

  if (matchID && challenger?.userId && challengee?.userId) {
    // Remove the challenge from state
    const { toYou = [], fromYou = [] } = appState?.challenges ?? {}
    setAppState({
      type: ACTION_TYPE.SET_CHALLENGES,
      payload: {
        toYou: reject(propEq('matchID', matchID))(toYou),
        fromYou: reject(propEq('matchID', matchID))(fromYou),
      },
    })

    const yourID = appState.user.id
    const opponent = yourID === challenger.userId ? challengee : challenger

    // Set match status to LOADING
    setAppState({
      type: ACTION_TYPE.SET_MATCH_LOADING,
      payload: {
        opponentID: opponent.userId,
        opponentName: opponent.userName,
        matchID,
      },
    })
  }
}
