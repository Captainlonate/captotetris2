import { Server } from 'socket.io'

import { ISocketIOSocket } from '../socketioServer'
import SessionStore from '../database/SessionStore'
import ChallengeStore from '../database/ChallengeStore'
import { SOCKET_EVENTS } from '../lib/SocketIOEvents'

// ========================================================

const getChallengesForUser = (userID: string) => ({
  everyoneYouChallenged: ChallengeStore.getEveryoneYouChallenged(userID) ?? [],
  everyoneWhoChallengedYou: ChallengeStore.getEveryoneWhoChallengedYou(userID) ?? [],
})


/*
  Handles when a user (A) challenges another user (B) to a match.
*/
export const handleChallengeAnotherUser = (socketIOServer: Server, challengerSocket: ISocketIOSocket) => {
  challengerSocket.on(SOCKET_EVENTS.C2S.CHALLENGE, async (challengeeUserID) => {
    // Confirm that the person who was challenged is a known user, who
    // is currently online
    const challengerUserID = challengerSocket.userID
    const personChallenged = SessionStore.findSessionByUserId(challengeeUserID)
    if (personChallenged && personChallenged?.connected && !!challengerUserID) {
      console.log(`${challengerSocket.userName} wants to challenge ${personChallenged.userName}`)
      // Store the new challenge
      ChallengeStore.aChallengesB(challengerUserID, challengeeUserID)
      // Update the challenger's incoming/outgoing challenge status
      challengerSocket.emit(
        SOCKET_EVENTS.S2C.CHALLENGES_STATUS,
        getChallengesForUser(challengerUserID)
      )
      // Update the person challenged's incoming/outgoing challenge status
      challengerSocket.to(challengeeUserID).emit(
        SOCKET_EVENTS.S2C.CHALLENGES_STATUS,
        getChallengesForUser(challengeeUserID)
      )
    }
  })
}

/*
  Handles when a user (B) declines the challenge from user (A).
*/
export const handleDeclineChallenge = (socketIOServer: Server, challengeeSocket: ISocketIOSocket) => {
  challengeeSocket.on(SOCKET_EVENTS.C2S.DECLINE_CHALLENGE, async (challengerUserID) => {
    const challengeeUserID = challengeeSocket.userID
    if (challengeeUserID) {
      // Delete the challenge
      ChallengeStore.bDeclinesA(challengerUserID, challengeeUserID)
      // Update the challenger's incoming/outgoing challenge status
      challengeeSocket.to(challengerUserID).emit(
        SOCKET_EVENTS.S2C.CHALLENGES_STATUS,
        getChallengesForUser(challengerUserID)
      )
      // Update the person challenged's incoming/outgoing challenge status
      challengeeSocket.emit(
        SOCKET_EVENTS.S2C.CHALLENGES_STATUS,
        getChallengesForUser(challengeeUserID)
      )
    }
  })
}