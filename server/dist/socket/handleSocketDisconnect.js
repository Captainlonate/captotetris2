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
exports.handleSocketDisconnect = void 0;
const SocketIOEvents_1 = require("../lib/SocketIOEvents");
const SessionStore_1 = __importDefault(require("../database/SessionStore"));
const ChallengeStore_1 = __importDefault(require("../database/ChallengeStore"));
// ========================================================
const handleSocketDisconnect = (socketIOServer, socket) => {
    socket.on(SocketIOEvents_1.SOCKET_EVENTS.DISCONNECT, () => __awaiter(void 0, void 0, void 0, function* () {
        if (!socket.userID || !socket.sessionID || !socket.userName) {
            return;
        }
        // Confirm that this socket is not in any other room, anywhere
        const matchingSockets = yield socketIOServer.in(socket.userID).allSockets();
        const isDisconnectedFromEverywhere = matchingSockets.size === 0;
        if (isDisconnectedFromEverywhere) {
            // Notify other users that this user has disconnected
            socket.broadcast.emit(SocketIOEvents_1.SOCKET_EVENTS.S2C.USER_DISCONNECTED, socket.userID);
            // Remove all incoming/outgoing challenges involving this user
            ChallengeStore_1.default.clearUser(socket.userID);
            // Update the session store that this user has disconnected
            const disconnectedUserSession = {
                userID: socket.userID,
                userName: socket.userName,
                connected: false,
            };
            SessionStore_1.default.saveSession(socket.sessionID, disconnectedUserSession);
        }
    }));
};
exports.handleSocketDisconnect = handleSocketDisconnect;
