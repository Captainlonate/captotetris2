"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
class TwoIndexDataStructure {
    constructor() {
        this.aToB = new Map();
        this.bByA = new Map();
    }
    addAToB(aID, bID) {
        var _a, _b;
        // Initialize the two Set's (if needed)
        if (!this.aToB.has(aID)) {
            this.aToB.set(aID, new Set());
        }
        if (!this.bByA.has(bID)) {
            this.bByA.set(bID, new Set());
        }
        (_a = this.aToB.get(aID)) === null || _a === void 0 ? void 0 : _a.add(bID);
        (_b = this.bByA.get(bID)) === null || _b === void 0 ? void 0 : _b.add(aID);
    }
    removeAToB(aID, bID) {
        var _a, _b;
        if (this.aToB.has(aID)) {
            (_a = this.aToB.get(aID)) === null || _a === void 0 ? void 0 : _a.delete(bID);
        }
        if (this.bByA.has(bID)) {
            (_b = this.bByA.get(bID)) === null || _b === void 0 ? void 0 : _b.delete(aID);
        }
    }
    removeEverythingForID(id) {
        // remove all forward pointers to 'id'
        const everyAPointingToID = this.bByA.get(id);
        if (everyAPointingToID instanceof Set) {
            everyAPointingToID.forEach(aID => {
                var _a;
                (_a = this.aToB.get(aID)) === null || _a === void 0 ? void 0 : _a.delete(id);
            });
        }
        // remove all reverse lookups back to 'id'
        const everythingIDPointsAt = this.aToB.get(id);
        if (everythingIDPointsAt instanceof Set) {
            everythingIDPointsAt.forEach(bID => {
                var _a;
                (_a = this.bByA.get(bID)) === null || _a === void 0 ? void 0 : _a.delete(id);
            });
        }
        this.aToB.delete(id);
        this.bByA.delete(id);
    }
    /*
      Is there a link from A to B
    */
    isAToB(aID, bID) {
        var _a;
        if (this.aToB.has(aID)) {
            return ((_a = this.aToB.get(aID)) === null || _a === void 0 ? void 0 : _a.has(bID)) === true;
        }
        return false;
    }
    /*
      Get everything that A points to
    */
    getAllA(aID) {
        const aSet = this.aToB.get(aID);
        if (aSet instanceof Set) {
            return Array.from(aSet);
        }
        return [];
    }
    /*
      Get everything that points to B
    */
    getAllB(bID) {
        const bSet = this.bByA.get(bID);
        if (bSet instanceof Set) {
            return Array.from(bSet);
        }
        return [];
    }
    debug() {
        console.log('aToB', this.aToB);
        console.log('bByA', this.bByA);
    }
}
exports.default = TwoIndexDataStructure;
