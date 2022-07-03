"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../lib/utils");
const SessionStore_1 = __importDefault(require("../database/SessionStore"));
const ApiError_1 = require("../lib/ApiError");
// ========================================================
// Attach this to a socketIO Server
const useSessionMiddleware = (io) => {
    io.use((socket, next) => {
        // If the client remembers their session id (browser storage)
        const sessionID = socket.handshake.auth.sessionID;
        if (sessionID) {
            // Try to load their information from the session store
            const session = SessionStore_1.default.findSession(sessionID);
            if (!session) {
                // If the session has expired (because server restarted)
                console.log('Expired session');
                return next(new Error(ApiError_1.SOCKETIO_ERROR_CODES.EXPIRED_SESSION));
            }
            // If the session is still valid
            console.log(session.userName + "'s session is known from store.");
            socket.sessionID = sessionID;
            socket.userID = session.userID;
            socket.userName = session.userName;
            return next();
        }
        const userName = socket.handshake.auth.username;
        if (!userName) {
            console.log("Missing 'socket.handshake.auth.username'");
            return next(new Error("invalid 'auth.username'"));
        }
        console.log(userName + "'s auth.username was provided by client.");
        socket.sessionID = (0, utils_1.makeRandomID)();
        socket.userID = (0, utils_1.makeRandomID)();
        socket.userName = userName;
        next();
    });
};
exports.default = useSessionMiddleware;
