import { Socket } from 'socket.io'

// ============================================

export interface ISocketIOSocket extends Socket {
  name?: string;
  sessionID?: string;
  userID?: string;
  userName?: string;
}