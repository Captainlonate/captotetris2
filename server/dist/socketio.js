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
exports.createSocketIOServer = void 0;
const socket_io_1 = require("socket.io");
const SessionStore_1 = __importDefault(require("./lib/SessionStore"));
const SocketIOEvents_1 = require("./lib/SocketIOEvents");
const useSessionMiddleware_1 = __importDefault(require("./socket/useSessionMiddleware"));
// ========================================================
const createSocketIOServer = (httpServer) => {
    const socketIOServer = new socket_io_1.Server(httpServer, {
        cors: {
            origin: [
                "http://localhost:1337",
                "http://localhost:3000",
                "https://breaks.pirated.technology",
            ],
            credentials: true
        },
    });
    // Middleware
    (0, useSessionMiddleware_1.default)(socketIOServer);
    // Listeners
    socketIOServer.on(SocketIOEvents_1.SOCKET_EVENTS.CONNECTION, (socket) => {
        if (!socket.sessionID || !socket.userID || !socket.userName) {
            return;
        }
        // Save this user's session
        const connectedUserSession = {
            userID: socket.userID,
            userName: socket.userName,
            connected: true,
        };
        SessionStore_1.default.saveSession(socket.sessionID, connectedUserSession);
        // Tell this user what their sessionId is
        socket.emit(SocketIOEvents_1.SOCKET_EVENTS.SESSION, {
            sessionID: socket.sessionID,
            userID: socket.userID,
            userName: socket.userName
        });
        // Join this user to their own room (userID room)
        socket.join(socket.userID);
        // Tell everyone else that this user has connected
        socket.broadcast.emit(SocketIOEvents_1.SOCKET_EVENTS.USER_CONNECTED, connectedUserSession);
        // notify all users that this user has disconnected
        socket.on(SocketIOEvents_1.SOCKET_EVENTS.DISCONNECT, () => __awaiter(void 0, void 0, void 0, function* () {
            if (socket.userID && socket.sessionID && socket.userName) {
                const matchingSockets = yield socketIOServer.in(socket.userID).allSockets();
                const isDisconnected = matchingSockets.size === 0;
                if (isDisconnected) {
                    // notify other users
                    socket.broadcast.emit(SocketIOEvents_1.SOCKET_EVENTS.USER_DISCONNECTED, socket.userID);
                    // update the connection status of the session
                    const disconnectedUserSession = {
                        userID: socket.userID,
                        userName: socket.userName,
                        connected: false,
                    };
                    SessionStore_1.default.saveSession(socket.sessionID, disconnectedUserSession);
                }
            }
        }));
        socket.on(SocketIOEvents_1.SOCKET_EVENTS.CHALLENGE, (challengeeUserID) => __awaiter(void 0, void 0, void 0, function* () {
            const personChallenged = SessionStore_1.default.findSessionByUserId(challengeeUserID);
            if (personChallenged && personChallenged.connected) {
                console.log(`${socket.userName} wants to challenge ${personChallenged.userName}`);
                socket.to(challengeeUserID).emit(SocketIOEvents_1.SOCKET_EVENTS.CHALLENGED, socket.userID);
            }
        }));
    });
    return socketIOServer;
};
exports.createSocketIOServer = createSocketIOServer;
