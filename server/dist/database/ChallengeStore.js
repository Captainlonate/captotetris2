"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const TwoIndexDataStructure_1 = __importDefault(require("../lib/TwoIndexDataStructure"));
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
    constructor() {
        this.challenges = new TwoIndexDataStructure_1.default();
    }
    aChallengesB(aUserID, bUserID) {
        this.challenges.addAToB(aUserID, bUserID);
    }
    bDeclinesA(aUserID, bUserID) {
        this.challenges.removeAToB(aUserID, bUserID);
    }
    clearUser(userID) {
        this.challenges.removeEverythingForID(userID);
    }
    getEveryoneYouChallenged(challengerUserID) {
        var _a;
        return (_a = this.challenges.getAllA(challengerUserID)) !== null && _a !== void 0 ? _a : [];
    }
    getEveryoneWhoChallengedYou(challengeeUserID) {
        var _a;
        return (_a = this.challenges.getAllB(challengeeUserID)) !== null && _a !== void 0 ? _a : [];
    }
}
const ChallengeStoreSingleton = new ChallengeStore();
exports.default = ChallengeStoreSingleton;
