import { Request, Response } from 'express'

import { IRequestWithLocals, localsUserIsValid } from '../../lib/middleware/jwt'
import { stringIsLength } from '../../lib/validators'
import DBService, { normalizeChatMessageForApi } from '../../database/DBService'
import {
  IErrorCodes,
  makeSuccessResponse,
  makeFailedResponse,
} from '../../lib/responseUtils'
import { pick } from '../../lib/utils'

// ========================================================

export class ChatsController {
  /**
   *
   * @param req
   * @param res
   */
  static async getRecentChats(req: Request, res: Response) {
    const limit = stringIsLength(req?.query?.limit, 1)
      ? Number(req?.query?.limit)
      : 30
    const page = stringIsLength(req?.query?.page, 1)
      ? Number(req?.query?.page)
      : 0
    const sort = req?.query?.sort === 'asc' ? req?.query?.sort : 'desc'

    const { data, error } = await DBService.GetRecentChats(limit, page, sort)
    if (error) {
      return res.json(
        makeFailedResponse(IErrorCodes.unknown_mongo_error, error)
      )
    }

    const recentChatMessages = data?.map(normalizeChatMessageForApi)

    res.json(makeSuccessResponse(recentChatMessages))
  }
  /**
   *
   * @param req
   * @param res
   * @returns
   */
  static async createChat(req: IRequestWithLocals, res: Response) {
    const chatMessage = req.body.message

    // Validate user submitted body
    if (!stringIsLength(chatMessage, 1)) {
      return res.json(
        makeFailedResponse(IErrorCodes.bad_user_input, `Invalid chat message.`)
      )
    }

    // Previous middleware should have set request.locals.user
    const user = req?.locals?.user

    if (!localsUserIsValid(user)) {
      return res.json(
        makeFailedResponse(
          IErrorCodes.jwt_unknown_user,
          `JWT: Missing active user info.`
        )
      )
    }

    const { data: newChatObj, error: errorCreateChat } =
      await DBService.CreateChat(user.username, chatMessage)

    if (errorCreateChat) {
      return res.json(
        makeFailedResponse(IErrorCodes.unknown_mongo_error, errorCreateChat)
      )
    }

    res.json(makeSuccessResponse(newChatObj))
  }
}
