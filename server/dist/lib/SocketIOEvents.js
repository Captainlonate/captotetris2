"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SOCKET_EVENTS = void 0;
exports.SOCKET_EVENTS = {
    CONNECTION: 'connection',
    DISCONNECT: 'disconnect',
    // Server emits these to Client
    S2C: {
        USER_CONNECTED: 'user_connected',
        USER_DISCONNECTED: 'user_disconnected',
        CHALLENGES_STATUS: 'challenges_status',
        SESSION: 'session',
        NEW_CHAT_MESSAGE: 'new_chat_message'
    },
    // Clients emits these to the Server
    C2S: {
        CHALLENGE: 'challenge',
        ACCEPT_CHALLENGE: 'accept_challenge',
        DECLINE_CHALLENGE: 'decline_challenge',
        POST_CHAT_MESSAGE: 'post_chat_message'
    }
};
