import { Request, Response } from 'express'

import { makeSuccessResponse } from '../../lib/ApiResponse'
import SessionStore from '../../database/SessionStore'

// ========================================================

export class UserController {
  static getAllUsers (req: Request, res: Response) {
    const allUsers = SessionStore.findAllSessions()
    res.json(makeSuccessResponse(allUsers))
  }
}
