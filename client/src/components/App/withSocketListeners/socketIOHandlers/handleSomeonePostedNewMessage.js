import {
  ACTION_TYPE,
  normalizeChatMessageFromApiForCtx,
} from '../../../../context/AppContext'

// ===================================================

/*
  When someone posts a new message (it could be you too)
*/
export const handleSomeonePostedNewMessage =
  (appState, setAppState) =>
  (newChatMessage = {}) => {
    if (newChatMessage) {
      const normalizedChatMessage = normalizeChatMessageFromApiForCtx(
        newChatMessage ?? {}
      )
      const updatedChatMessages = [
        ...appState?.chatMessages,
        normalizedChatMessage,
      ]
      setAppState({
        type: ACTION_TYPE.SET_ALL_CHATS,
        payload: updatedChatMessages,
      })
    }
  }
