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
exports.handleSocketChallenge = void 0;
const SessionStore_1 = __importDefault(require("../lib/SessionStore"));
const SocketIOEvents_1 = require("../lib/SocketIOEvents");
// ========================================================
const handleSocketChallenge = (socketIOServer, socket) => {
    socket.on(SocketIOEvents_1.SOCKET_EVENTS.C2S.CHALLENGE, (challengeeUserID) => __awaiter(void 0, void 0, void 0, function* () {
        const personChallenged = SessionStore_1.default.findSessionByUserId(challengeeUserID);
        if (personChallenged && personChallenged.connected) {
            console.log(`${socket.userName} wants to challenge ${personChallenged.userName}`);
            socket.to(challengeeUserID).emit(SocketIOEvents_1.SOCKET_EVENTS.S2C.CHALLENGED, socket.userID);
        }
    }));
};
exports.handleSocketChallenge = handleSocketChallenge;
