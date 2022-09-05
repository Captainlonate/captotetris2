export const SOCKET_EVENTS = {
  CONNECTION: 'connection',
  DISCONNECT: 'disconnect',
  // Server emits these to Client
  S2C: {
    USER_CONNECTED: 'user_connected',
    USER_DISCONNECTED: 'user_disconnected',
    NEW_CHAT_MESSAGE: 'new_chat_message',
    ALL_USERS: 'all_users',
    SOMEONE_CHALLENGED_YOU: 'someone_challenged_you',
    DECLINED_CHALLENGE: 'declined_challenge',
    CHALLENGE_START: 'challenge_start',
    MATCH_STARTED: 'match_started',
    YOU_CHALLENGED_ANOTHER: 'you_challenged_another',
  },
  // Clients emits these to the Server
  C2S: {
    CHALLENGE_TO: 'challenge_to',
    CHALLENGE_ACCEPT: 'challenge_accept',
    CHALLENGE_DECLINE: 'challenge_decline',
    MATCH_PLAYER_READY: 'match_player_ready',
    MATCH_CANCELLED: 'match_cancelled',
    POST_CHAT_MESSAGE: 'post_chat_message',
    GET_ALL_USERS: 'get_all_users',
  },
}
