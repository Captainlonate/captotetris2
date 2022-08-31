import { toast } from 'react-toastify'

import { API } from '../../network/Api'
import { ACTION_TYPE } from './reducer'
import { normalizeChatMessageFromApiForCtx } from './utils'
import Logger from '../../utils/Logger'

// ==============================================

export const loginUpdateCtx = (dispatchAppCtx) => {}

export const renewJWTUpdateCtx = (dispatchAppCtx) => {}

/**
 * Fetch the initial batch of chat messages from the api,
 * and then update the context with them.
 * @param {*} dispatch dispatch function for AppContext
 * @param {*} authToken JWT token to authenticate with api
 */
export const fetchInitialChatsAsync = async (dispatch, authToken) => {
  Logger.debug('Fetching initial chat messages')
  // Set the flag that prevents this from running multiple times
  dispatch({ type: ACTION_TYPE.HAS_FETCHED_INITIAL_CHATS })
  // Fetch the initial list of chat messages
  const chatApiResponse = await API.GetRecentChats(authToken)
  if (chatApiResponse.isError) {
    toast('Could not fetch recent chats.')
    Logger.error('Error fetching recent chats')
    return
  }
  // Update the Context with the new chat messages
  dispatch({
    type: 'SET_ALL_CHATS',
    payload: chatApiResponse.data
      ?.map(normalizeChatMessageFromApiForCtx)
      .reverse(),
  })
}
