import TwoIndexDataStructure from '../lib/TwoIndexDataStructure'

// ========================================================

type UserID = string

// ========================================================

/*
  Manages all challenges that a user has sent out, as well as
  all challenges sent to him.

  When a user challenges another user, use 'aChallengesB()'
  When that other user declines it, use 'bDeclinesA()'
  When a user disconnects from the server, remove them from
    all challenges using 'clearUser()'
  To get a list of everyone a user has challenged,
    use 'getEveryoneYouChallenged()'
  To get a list of everyone who has challenged a user,
    use 'getEveryoneWhoChallengedYou()'
  
  All users are stored by their UserID (string).
*/
class ChallengeStore {
  private challenges: TwoIndexDataStructure<UserID>;

  constructor() {
    this.challenges = new TwoIndexDataStructure<UserID>()
  }

  aChallengesB (aUserID: UserID, bUserID: UserID) {
    this.challenges.addAToB(aUserID, bUserID)
  }

  bDeclinesA (aUserID: UserID, bUserID: UserID) {
    this.challenges.removeAToB(aUserID, bUserID)
  }

  clearUser (userID: UserID) {
    this.challenges.removeEverythingForID(userID)
  }
  
  getEveryoneYouChallenged (challengerUserID: UserID): UserID[] {
    return this.challenges.getAllA(challengerUserID) ?? []
  }
  
  getEveryoneWhoChallengedYou (challengeeUserID: UserID): UserID[] {
    return this.challenges.getAllB(challengeeUserID) ?? []
  }
}

const ChallengeStoreSingleton = new ChallengeStore()

export default ChallengeStoreSingleton
