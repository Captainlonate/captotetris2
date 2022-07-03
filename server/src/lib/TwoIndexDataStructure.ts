/*
  I created this custom data structure to handle when
  a User Challenges another User to a match.

  When User_A challenges User_B, it's easy enough
  to make a Map<UserID, Set<UserID>>:
    {
      // User_A -> Everyone that User_A has challenged
      A_UserID: [B_UserID, C_UserID],
    }
  In this way, there is a single index to look up every
  other user (B, C) who a given user (A) has challenged.

  But, if a User_B wants to know every user who has
  challenged him, then we need to "reverse lookup" everyone
  who has 'B' in their Set. To make lookups fast as the dataset
  grows, we need a second index.
  Map<UserID, Set<UserID>>:
    {
      // User_B -> Everyone who has challenged User_B
      B_UserID: [A_UserID]
    }
*/
class TwoIndexDataStructure<T> {
  // a, pointing to Set of b's
  private aToB: Map<T, Set<T>>; 
  // Reverse lookup
  // b, pointing to Set of a's that are pointing to b
  private bByA: Map<T, Set<T>>; 

  constructor () {
    this.aToB = new Map<T, Set<T>>();
    this.bByA = new Map<T, Set<T>>();
  }

  addAToB (aID: T, bID: T) {
    // Initialize the two Set's (if needed)
    if (!this.aToB.has(aID)) {
      this.aToB.set(aID, new Set<T>())
    }
    if (!this.bByA.has(bID)) {
      this.bByA.set(bID, new Set<T>())
    }

    this.aToB.get(aID)?.add(bID)
    this.bByA.get(bID)?.add(aID)
  }

  removeAToB (aID: T, bID: T) {
    if (this.aToB.has(aID)) {
      this.aToB.get(aID)?.delete(bID)
    }
    if (this.bByA.has(bID)) {
      this.bByA.get(bID)?.delete(aID)
    }
  }

  removeEverythingForID (id: T) {
    // remove all forward pointers to 'id'
    const everyAPointingToID = this.bByA.get(id)
    if (everyAPointingToID instanceof Set) {
      everyAPointingToID.forEach(aID => {
        this.aToB.get(aID)?.delete(id)
      })
    }

    // remove all reverse lookups back to 'id'
    const everythingIDPointsAt = this.aToB.get(id)
    if (everythingIDPointsAt instanceof Set) {
      everythingIDPointsAt.forEach(bID => {
        this.bByA.get(bID)?.delete(id)
      })
    }

    this.aToB.delete(id)
    this.bByA.delete(id)
  }

  /*
    Is there a link from A to B
  */
  isAToB (aID: T, bID: T): boolean {
    if (this.aToB.has(aID)) {
      return this.aToB.get(aID)?.has(bID) === true
    }
    return false
  }

  /*
    Get everything that A points to
  */
  getAllA (aID: T): T[] {
    const aSet = this.aToB.get(aID)
    if (aSet instanceof Set) {
      return Array.from(aSet)
    }
    return []
  }

  /*
    Get everything that points to B
  */
  getAllB (bID: T): T[] {
    const bSet = this.bByA.get(bID)
    if (bSet instanceof Set) {
      return Array.from(bSet)
    }
    return []
  }
  
  debug () {
    console.log('aToB', this.aToB)
    console.log('bByA', this.bByA)
  }
}

export default TwoIndexDataStructure
