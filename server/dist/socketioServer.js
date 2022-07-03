"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.attachSocketIOServerToHttpServer = void 0;
const socket_io_1 = require("socket.io");
const SessionStore_1 = __importDefault(require("./database/SessionStore"));
const SocketIOEvents_1 = require("./lib/SocketIOEvents");
const useSessionMiddleware_1 = __importDefault(require("./socket/useSessionMiddleware"));
const handleSocketDisconnect_1 = require("./socket/handleSocketDisconnect");
const handleSocketChats_1 = require("./socket/handleSocketChats");
const handleSocketChallenge_1 = require("./socket/handleSocketChallenge");
// ========================================================
const attachSocketIOServerToHttpServer = (httpServer) => {
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
        // By this point we should have:
        //  sessionID = Provided by the client, originally generated
        //  userID = Loaded from sessionStore
        //  userName = Provided by the client, or loaded from sessionStore
        if (!socket.sessionID || !socket.userID || !socket.userName) {
            return;
        }
        // Save this user's session in the session store
        const connectedUserSession = {
            userID: socket.userID,
            userName: socket.userName,
            connected: true,
        };
        SessionStore_1.default.saveSession(socket.sessionID, connectedUserSession);
        // Join this user to their own room (userID room)
        socket.join(socket.userID);
        // Tell this user what their sessionId is
        socket.emit(SocketIOEvents_1.SOCKET_EVENTS.S2C.SESSION, {
            sessionID: socket.sessionID,
            userID: socket.userID,
            userName: socket.userName
        });
        // Tell everyone else that this user has connected
        socket.broadcast.emit(SocketIOEvents_1.SOCKET_EVENTS.S2C.USER_CONNECTED, connectedUserSession);
        // Listen for events and handle them
        (0, handleSocketDisconnect_1.handleSocketDisconnect)(socketIOServer, socket);
        (0, handleSocketChallenge_1.handleChallengeAnotherUser)(socketIOServer, socket);
        (0, handleSocketChallenge_1.handleDeclineChallenge)(socketIOServer, socket);
        (0, handleSocketChats_1.handlePostChatMessage)(socketIOServer, socket);
    });
    return socketIOServer;
};
exports.attachSocketIOServerToHttpServer = attachSocketIOServerToHttpServer;
