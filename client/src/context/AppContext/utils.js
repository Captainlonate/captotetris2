/**
 * The API returns chat message objects a certain way.
 * They might need to be stored a different way, in the
 * AppContext, via the reducer. So this will transform
 * the API objects into the correct format.
 * @param {*} chatObj Chat message object from api
 * @returns transformed/normalized chat message object
 *  intended to be stored in the AppContext
 */
export const normalizeChatMessageFromApiForCtx = (chatObj) => ({
  id: chatObj._id ?? chatObj.id ?? chatObj.chatId ?? chatObj.chatID,
  author: chatObj.author,
  message: chatObj.message,
  createdAt: chatObj.createdAt
    ? new Date(chatObj.createdAt).toLocaleString('en-US')
    : undefined,
  // createdAt: chatObj.createdAt,
})

/**
 *
 * @param {*} user User objects from the api
 * @returns transformed/normalized user objects intended
 *  to be stored in the AppContext
 */
export const normalizeUsersFromApiForCtx = (user) => ({
  userId: user._id ?? user.id ?? user.userId ?? user.userID,
  userName: user.username ?? user.userName,
  online: user.online,
})
