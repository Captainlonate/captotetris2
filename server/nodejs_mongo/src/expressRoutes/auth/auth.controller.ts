import { Request, Response } from 'express'

import { CreateJWT, renewJWT } from '../../lib/middleware/jwt'
import { stringIsLength } from '../../lib/validators'
import DBService from '../../database/DBService'
import {
  IErrorCodes,
  makeSuccessResponse,
  makeFailedResponse,
} from '../../lib/responseUtils'

// ========================================================

export class AuthController {
  /**
   * Express Route Handler - Register a new user
   */
  static async register(req: Request, res: Response) {
    const username = req.body.username
    const password = req.body.password

    // Validate user submitted body
    if (!stringIsLength(username, 3) || !stringIsLength(password, 3)) {
      return res.json(
        makeFailedResponse(
          IErrorCodes.signup_bad_data,
          `Invalid or missing 'password' or 'username'.`
        )
      )
    }

    // Check if the unique username already exists
    const { data: alreadyExistingUser, error: errorFindUser } =
      await DBService.FindUserByUsername(username)

    if (errorFindUser) {
      return res.json(
        makeFailedResponse(IErrorCodes.unknown_mongo_error, errorFindUser)
      )
    }

    if (alreadyExistingUser) {
      return res.json(
        makeFailedResponse(
          IErrorCodes.signup_existing_user,
          `A user already exists with that username.`
        )
      )
    }

    // Create the new user record
    const { data: newUserObj, error: errorCreateUser } =
      await DBService.CreateUser(username, password)

    if (!newUserObj || errorCreateUser) {
      return res.json(
        makeFailedResponse(IErrorCodes.unknown_mongo_error, errorCreateUser)
      )
    }

    // Automatically sign them in with the newly created account
    const token = CreateJWT({
      uuid: newUserObj.id,
      username: newUserObj.username,
    })

    return res.json(
      makeSuccessResponse({
        username: newUserObj.username,
        jwtToken: token,
      })
    )
  }
  /**
   *
   * @param req
   * @param res
   */
  static async login(req: Request, res: Response) {
    const password = req.body?.password
    const username = req.body?.username

    const { data: user, error: errorFindUser } =
      await DBService.FindAuthenticatedUser(username, password)

    if (errorFindUser) {
      return res.json(
        makeFailedResponse(IErrorCodes.unknown_mongo_error, errorFindUser)
      )
    }

    if (!user) {
      return res.json(
        makeFailedResponse(
          IErrorCodes.auth_wrong_credentials,
          `Wrong 'username' or 'password'.`
        )
      )
    }

    const token = CreateJWT({
      uuid: user.id,
      username: user.username,
    })

    return res.json(makeSuccessResponse(token))
  }

  /**
   *
   * @param req
   * @param res
   * @returns
   */
  static refreshJWT(req: Request, res: Response) {
    const authHeader = req.headers['authorization']
    const accessToken = authHeader && authHeader.split(' ')[1]

    if (!accessToken) {
      return res.json(
        makeFailedResponse(IErrorCodes.missing_jwt, 'Missing/No Token.')
      )
    }

    const { newJWT, error } = renewJWT(accessToken)

    if (error) {
      return res.json(
        makeFailedResponse(
          IErrorCodes.cannot_renew_jwt,
          `Could not renew JWT: ${error}`
        )
      )
    }

    return res.json(makeSuccessResponse(newJWT))
  }

  /**
   *
   * @param req
   * @param res
   */
  static logout(req: Request, res: Response) {
    res.json(makeSuccessResponse([]))
  }
}
