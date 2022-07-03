"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleDeclineChallenge = exports.handleChallengeAnotherUser = void 0;
const SessionStore_1 = __importDefault(require("../database/SessionStore"));
const ChallengeStore_1 = __importDefault(require("../database/ChallengeStore"));
const SocketIOEvents_1 = require("../lib/SocketIOEvents");
// ========================================================
const getChallengesForUser = (userID) => {
    var _a, _b;
    return ({
        everyoneYouChallenged: (_a = ChallengeStore_1.default.getEveryoneYouChallenged(userID)) !== null && _a !== void 0 ? _a : [],
        everyoneWhoChallengedYou: (_b = ChallengeStore_1.default.getEveryoneWhoChallengedYou(userID)) !== null && _b !== void 0 ? _b : [],
    });
};
/*
  Handles when a user (A) challenges another user (B) to a match.
*/
const handleChallengeAnotherUser = (socketIOServer, challengerSocket) => {
    challengerSocket.on(SocketIOEvents_1.SOCKET_EVENTS.C2S.CHALLENGE, (challengeeUserID) => __awaiter(void 0, void 0, void 0, function* () {
        // Confirm that the person who was challenged is a known user, who
        // is currently online
        const challengerUserID = challengerSocket.userID;
        const personChallenged = SessionStore_1.default.findSessionByUserId(challengeeUserID);
        if (personChallenged && (personChallenged === null || personChallenged === void 0 ? void 0 : personChallenged.connected) && !!challengerUserID) {
            console.log(`${challengerSocket.userName} wants to challenge ${personChallenged.userName}`);
            // Store the new challenge
            ChallengeStore_1.default.aChallengesB(challengerUserID, challengeeUserID);
            // Update the challenger's incoming/outgoing challenge status
            challengerSocket.emit(SocketIOEvents_1.SOCKET_EVENTS.S2C.CHALLENGES_STATUS, getChallengesForUser(challengerUserID));
            // Update the person challenged's incoming/outgoing challenge status
            challengerSocket.to(challengeeUserID).emit(SocketIOEvents_1.SOCKET_EVENTS.S2C.CHALLENGES_STATUS, getChallengesForUser(challengeeUserID));
        }
    }));
};
exports.handleChallengeAnotherUser = handleChallengeAnotherUser;
/*
  Handles when a user (B) declines the challenge from user (A).
*/
const handleDeclineChallenge = (socketIOServer, challengeeSocket) => {
    challengeeSocket.on(SocketIOEvents_1.SOCKET_EVENTS.C2S.DECLINE_CHALLENGE, (challengerUserID) => __awaiter(void 0, void 0, void 0, function* () {
        const challengeeUserID = challengeeSocket.userID;
        if (challengeeUserID) {
            // Delete the challenge
            ChallengeStore_1.default.bDeclinesA(challengerUserID, challengeeUserID);
            // Update the challenger's incoming/outgoing challenge status
            challengeeSocket.to(challengerUserID).emit(SocketIOEvents_1.SOCKET_EVENTS.S2C.CHALLENGES_STATUS, getChallengesForUser(challengerUserID));
            // Update the person challenged's incoming/outgoing challenge status
            challengeeSocket.emit(SocketIOEvents_1.SOCKET_EVENTS.S2C.CHALLENGES_STATUS, getChallengesForUser(challengeeUserID));
        }
    }));
};
exports.handleDeclineChallenge = handleDeclineChallenge;
