import { Request, Response } from 'express'

import { makeSuccessResponse } from '../../lib/ApiResponse'
import { ProcessBreaks } from '../../lib/GameLogic'
// import SessionStore from '../../database/SessionStore'

// ========================================================

export class GameController {
  static handleBreak (req: Request, res: Response) {
    if (Array.isArray(req?.body?.breaks)) {
      const trashPerColumn = ProcessBreaks(req?.body?.breaks)
      res.json(trashPerColumn)
    } else {
      res.json([])
    }
  }
}
