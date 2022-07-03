"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const SessionStore_1 = __importDefault(require("../lib/SessionStore"));
const utils_1 = require("../lib/utils");
const ApiError_1 = require("../lib/ApiError");
io.use((socket, next) => {
    const sessionID = socket.handshake.auth.sessionID;
    const userName = socket.handshake.auth.username;
    // If the client remembers their session id
    if (sessionID) {
        const session = SessionStore_1.default.findSession(sessionID);
        if (session) {
            // If the session is still valid
            console.log(session.userName + "'s session is known from store.");
            socket.sessionID = sessionID;
            socket.userID = session.userID;
            socket.userName = session.userName;
            return next();
        }
        else {
            // else, if the session has expired
            console.log('Expired session');
            return next(new Error(ApiError_1.SOCKETIO_ERROR_CODES.EXPIRED_SESSION));
        }
    }
    if (!userName) {
        console.log("Missing 'socket.handshake.auth.username'");
        return next(new Error("invalid 'auth.username'"));
    }
    else {
        console.log(userName + "'s auth.username was provided.");
    }
    socket.sessionID = (0, utils_1.makeRandomID)();
    socket.userID = (0, utils_1.makeRandomID)();
    socket.userName = userName;
    next();
});
