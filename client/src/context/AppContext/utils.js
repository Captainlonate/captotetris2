/**
 * The API returns chat message objects a certain way.
 * They might need to be stored a different way, in the
 * AppContext, via the reducer. So this will transform
 * the API objects into the correct format.
 * @param {*} obj Chat message object from api
 * @returns transformed/normalized chat message object
 *  intended to be stored in the AppContext
 */
export const normalizeChatMessageFromApiForCtx = (obj) => ({
  id: obj._id ?? obj.id,
  author: obj.author,
  message: obj.message,
  createdAt: obj.createdAt,
})

/**
 *
 * @param {*} obj User objects from the api
 * @returns transformed/normalized user objects intended
 *  to be stored in the AppContext
 */
export const normalizeUsersFromApiForCtx = (apiUserObj) => ({
  userID: apiUserObj._id ?? apiUserObj.id,
  userName: apiUserObj.username,
})
