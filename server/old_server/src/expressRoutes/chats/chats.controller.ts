import { Request, Response } from 'express'

import { makeSuccessResponse } from '../../lib/ApiResponse'
import ChatsStore from '../../database/ChatsStore'

// ========================================================

export class ChatsController {
  static getRecentChats (req: Request, res: Response) {
    const recentChatMessages = ChatsStore.getRecentChats(30)
    res.json(makeSuccessResponse(recentChatMessages))
  }
}
