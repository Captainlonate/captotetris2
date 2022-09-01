import { Request, Response } from 'express'
import { Server, Socket } from 'socket.io'

import DBService from '../../database/DBService'
import { UserModel } from '../../database/models'
import { IRequestWithLocals, localsUserIsValid } from '../../lib/middleware/jwt'
import {
  IErrorCodes,
  makeSuccessResponse,
  makeFailedResponse,
} from '../../lib/responseUtils'

// ========================================================

export class UserController {
  static async getMe(req: IRequestWithLocals, res: Response) {
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

    // Fetch the logged in user (by the id parsed from JWT)
    const { data: loggedInUser, error } = await DBService.GetUserById(
      user.userId,
      'username _id'
    )

    if (error) {
      return res.json(
        makeFailedResponse(IErrorCodes.unknown_mongo_error, error)
      )
    }
    if (!loggedInUser) {
      return res.json(
        makeFailedResponse(
          IErrorCodes.no_user_found,
          'JWT found but no user exists.'
        )
      )
    }

    res.json(makeSuccessResponse(loggedInUser))
  }
  /**
   *
   * @param req
   * @param res
   */
  static async getAllUsers(req: Request, res: Response) {
    const allUsers = await UserModel.find({}, 'username _id')
    res.json(makeSuccessResponse(allUsers))
  }
  /**
   *
   * @param req
   * @param res
   * @returns
   */
  static async getAllConnectedUsers(req: Request, res: Response) {
    // This needs to be set with expressApp.set('socketios', SocketIOServer)
    const socketIOServer = req.app.get('socketios') as Server | undefined

    if (!socketIOServer) {
      return res.json(
        makeFailedResponse(
          IErrorCodes.unknown_server_error,
          'Could not access socketio from express handler.'
        )
      )
    }

    const allConnectedPlayerIdsSet = await socketIOServer
      .in('player_lobby')
      .allSockets()

    const allUsers = await UserModel.find({}, 'username _id')
    const onlineUsers = allUsers.filter(({ _id }) =>
      allConnectedPlayerIdsSet.has(_id)
    )

    res.json(makeSuccessResponse(onlineUsers))
  }
}
