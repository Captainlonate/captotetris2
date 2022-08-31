import { SessionID, UserSession } from './SessionStore.d'

// ========================================================

class SessionStore {
  findSession(id: string) {}
  findSessionByUserId(id: string) {}
  saveSession(id: string, session: UserSession) {}
  findAllSessions() {}
}

class InMemorySessionStore extends SessionStore {
  private sessions: Map<SessionID, UserSession>;
  private userIdToSessionId: Map<string, SessionID>;

  constructor() {
    super();
    this.sessions = new Map();
    this.userIdToSessionId = new Map();
  }

  findSession(sessionID: SessionID) {
    return this.sessions.get(sessionID);
  }

  findSessionByUserId(userID: string) {
    const sessionId = this.userIdToSessionId.get(userID)
    return sessionId ? this.sessions.get(sessionId) : undefined;
  }

  saveSession(sessionId: SessionID, session: UserSession) {
    this.sessions.set(sessionId, session);
    this.userIdToSessionId.set(session.userID, sessionId)
  }

  findAllSessions() {
    return [...this.sessions.values()];
  }
}

const SessionStoreSingleton = new InMemorySessionStore()

export default SessionStoreSingleton

export { SessionID, UserSession } from './SessionStore.d'