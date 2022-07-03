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
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleSocketDisconnect = void 0;
const handleSocketDisconnect = () => () => __awaiter(void 0, void 0, void 0, function* () {
    if (socket.userID && socket.sessionID && socket.userName) {
        const matchingSockets = yield socketIOServer.in(socket.userID).allSockets();
        const isDisconnected = matchingSockets.size === 0;
        if (isDisconnected) {
            // notify other users
            socket.broadcast.emit(SOCKET_EVENTS.USER_DISCONNECTED, socket.userID);
            // update the connection status of the session
            const disconnectedUserSession = {
                userID: socket.userID,
                userName: socket.userName,
                connected: false,
            };
            SessionStore.saveSession(socket.sessionID, disconnectedUserSession);
        }
    }
});
exports.handleSocketDisconnect = handleSocketDisconnect;
