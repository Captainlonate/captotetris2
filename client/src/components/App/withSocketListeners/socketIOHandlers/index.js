import { handleConnection } from './handleConnection'
import { handleDisconnect } from './handleDisconnect'
import { handleConnectionError } from './handleConnectionError'
import { handleReceivedAllUsers } from './handleReceivedAllUsers'
import { handleOtherUserConnected } from './handleOtherUserConnected'
import { handleOtherUserDisconnected } from './handleOtherUserDisconnected'
import { handleYouChallengedAnother } from './handleYouChallengedAnother'
import { handleSomeoneChallengedYou } from './handleSomeoneChallengedYou'
import { handleDeclineChallenge } from './handleDeclineChallenge'
import { handleSomeonePostedNewMessage } from './handleSomeonePostedNewMessage'

import Logger from '../../../../utils/Logger'
import { SOCKET_EVENTS } from '../../../../network/socketio'

const {
  CONNECT,
  DISCONNECT,
  CONNECT_ERROR,
  S2C: {
    ALL_USERS,
    USER_CONNECTED,
    USER_DISCONNECTED,
    YOU_CHALLENGED_ANOTHER,
    SOMEONE_CHALLENGED_YOU,
    DECLINED_CHALLENGE,
    NEW_CHAT_MESSAGE,
  },
} = SOCKET_EVENTS

// ==============================================

export class SocketHandlers {
  constructor(appState, setAppState, socketConn) {
    this.state = appState
    this.setState = setAppState
    this.socket = socketConn
  }

  register = () => {
    // When you connect
    this.socket.on(CONNECT, this.handleConnection)
    // When you disconnect
    this.socket.on(DISCONNECT, this.handleDisconnect)
    // When you have a connection error
    this.socket.on(CONNECT_ERROR, this.handleConnectionError)
    // When you receive all user objects
    this.socket.on(ALL_USERS, this.handleReceivedAllUsers)
    // When another user connects
    this.socket.on(USER_CONNECTED, this.handleOtherUserConnected)
    // When another user disconnects
    this.socket.on(USER_DISCONNECTED, this.handleOtherUserDisconnected)
    // When you challenge another user
    this.socket.on(YOU_CHALLENGED_ANOTHER, this.handleYouChallengedAnother)
    // When someone challenges you
    this.socket.on(SOMEONE_CHALLENGED_YOU, this.handleSomeoneChallengedYou)
    // When a challenge is declined that you are a part of
    this.socket.on(DECLINED_CHALLENGE, this.handleDeclineChallenge)
    // When you receive a new chat message
    this.socket.on(NEW_CHAT_MESSAGE, this.handleSomeonePostedNewMessage)
  }

  unRegister = () => {
    this.socket.off(CONNECT, this.handleConnection)
    this.socket.off(DISCONNECT, this.handleDisconnect)
    this.socket.off(CONNECT_ERROR, this.handleConnectionError)
    this.socket.off(ALL_USERS, this.handleReceivedAllUsers)
    this.socket.off(USER_CONNECTED, this.handleOtherUserConnected)
    this.socket.off(USER_DISCONNECTED, this.handleOtherUserDisconnected)
    this.socket.off(YOU_CHALLENGED_ANOTHER, this.handleYouChallengedAnother)
    this.socket.off(SOMEONE_CHALLENGED_YOU, this.handleSomeoneChallengedYou)
    this.socket.off(DECLINED_CHALLENGE, this.handleDeclineChallenge)
    this.socket.off(NEW_CHAT_MESSAGE, this.handleSomeonePostedNewMessage)
  }

  // =============== Handlers ===================

  handleConnection = (data) => {
    Logger.network(`-- SOCKET EVENT -- Connected`, data)
    handleConnection(this.state, this.setState, this.socket)(data)
  }

  handleDisconnect = (data) => {
    Logger.network('-- SOCKET EVENT -- Disconnected:', data)
    handleDisconnect(this.state, this.setState, this.socket)(data)
  }

  handleConnectionError = (data) => {
    Logger.network('-- SOCKET EVENT -- Connection Error', data)
    handleConnectionError(this.state, this.setState, this.socket)(data)
  }

  handleReceivedAllUsers = (data) => {
    Logger.network('-- SOCKET EVENT -- Received all users.', data)
    handleReceivedAllUsers(this.state, this.setState, this.socket)(data)
  }

  handleOtherUserConnected = (data) => {
    Logger.network('-- SOCKET EVENT -- A user connected.', data)
    handleOtherUserConnected(this.state, this.setState, this.socket)(data)
  }

  handleOtherUserDisconnected = (data) => {
    Logger.network('-- SOCKET EVENT -- A user DISconnected.', data)
    handleOtherUserDisconnected(this.state, this.setState, this.socket)(data)
  }

  handleYouChallengedAnother = (data) => {
    Logger.network('-- SOCKET EVENT -- You challenged someone.', data)
    handleYouChallengedAnother(this.state, this.setState, this.socket)(data)
  }

  handleSomeoneChallengedYou = (data) => {
    Logger.network('-- SOCKET EVENT -- Someone challenged you.', data)
    handleSomeoneChallengedYou(this.state, this.setState, this.socket)(data)
  }

  handleDeclineChallenge = (data) => {
    Logger.network('-- SOCKET EVENT -- A challenge was declined.', data)
    handleDeclineChallenge(this.state, this.setState, this.socket)(data)
  }

  handleSomeonePostedNewMessage = (data) => {
    Logger.network('-- SOCKET EVENT -- Received new chat message.', data)
    handleSomeonePostedNewMessage(this.state, this.setState, this.socket)(data)
  }
}
