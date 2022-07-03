"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// ========================================================
class SessionStore {
    findSession(id) { }
    findSessionByUserId(id) { }
    saveSession(id, session) { }
    findAllSessions() { }
}
class InMemorySessionStore extends SessionStore {
    constructor() {
        super();
        this.sessions = new Map();
        this.userIdToSessionId = new Map();
    }
    findSession(sessionID) {
        return this.sessions.get(sessionID);
    }
    findSessionByUserId(userID) {
        const sessionId = this.userIdToSessionId.get(userID);
        return sessionId ? this.sessions.get(sessionId) : undefined;
    }
    saveSession(sessionId, session) {
        this.sessions.set(sessionId, session);
        this.userIdToSessionId.set(session.userID, sessionId);
    }
    findAllSessions() {
        return [...this.sessions.values()];
    }
}
const SessionStoreSingleton = new InMemorySessionStore();
exports.default = SessionStoreSingleton;
