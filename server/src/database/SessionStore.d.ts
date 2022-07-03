export type SessionID = string

export type UserSession = {
  // sessionID?: string,
  userID: string,
  userName: string,
  connected: boolean
}