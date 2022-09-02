import jwt, { TokenExpiredError } from 'jsonwebtoken'
import { Request, Response, NextFunction } from 'express'

import { stringIsLength } from '../validators'
import {
  IFailedResponse,
  IErrorCodes,
  makeFailedResponse,
} from '../responseUtils'

/**
 * The structure of request.locals.user
 * Be sure to update any type checker utilities
 *  like localsUserIsValid
 */
export type TReqLocalsUser = {
  userId?: string
  username?: string
}
export type TReqLocalsUserValid = Required<TReqLocalsUser>

/**
 * The structure of request.locals
 */
export type TReqLocals = {
  user?: TReqLocalsUser
}

/**
 * The structure of the JWT that is passed in.
 * These fields are expected to be on it, but
 * they're optional here until code can confirm.
 * Once the fields are confirmed, use `IJWTPayloadValid` instead.
 */
export type TJWTPayload = {
  uuid?: string
  username?: string
}
export type TJWTPayloadValid = Required<TJWTPayload>

/**
 * A type that adds 'locals' to express.Request.
 */
export interface IRequestWithLocals extends Request {
  locals?: TReqLocals
}

/**
 * I wanted to deliberately make sure that `parsedJWT` is
 * mutually exclusive from `failedResponse` and `isExpired`.
 * If `parsedJWT`, then not `isExpired` + `failedResponse`.
 */
type TParsedJWTResults =
  | { parsedJWT: TJWTPayload; isExpired: false; failedResponse: null }
  | { parsedJWT: null; isExpired: boolean; failedResponse: IFailedResponse }

// ==============================================

/**
 *
 * @param accessToken The JWT token string (probably taken from
 *  an Authorization header.)
 * @returns
 */
export const ParseJWT = (accessToken: string): TParsedJWTResults => {
  try {
    // Attempt to verify the JWT's signature and expiration date
    const payload = jwt.verify(
      accessToken,
      process.env.JWT_SIGN_KEY as string,
      { algorithms: ['HS256'] }
    )
    return {
      parsedJWT: (payload ?? {}) as TJWTPayload,
      isExpired: false,
      failedResponse: null,
    }
  } catch (ex: any) {
    // If the token has expired
    if (ex instanceof TokenExpiredError) {
      return {
        parsedJWT: null,
        isExpired: true,
        failedResponse: makeFailedResponse(
          IErrorCodes.expired_jwt,
          `JWT expired: "${ex.expiredAt}"`
        ),
      }
    } else {
      // If the token had an 'invalid signature' or other error
      console.log(`Error from jwt.verify(accessToken):\n\t${ex?.message}\n`)
      return {
        parsedJWT: null,
        isExpired: false,
        failedResponse: makeFailedResponse(
          IErrorCodes.bad_token,
          `JWT found but cannot be verified/parsed: "${ex?.message}"`
        ),
      }
    }
  }
}

/**
 * Given a parsed JWT token object, confirm it contains
 * the expected fields.
 * @param jwtObj
 * @returns true if the token object contains the expected fields
 */
export const checkJWTFields = (
  jwtObj: TJWTPayload | null
): jwtObj is TJWTPayloadValid =>
  !!jwtObj &&
  stringIsLength(jwtObj?.uuid, 1) &&
  stringIsLength(jwtObj?.username, 1)

/**
 * Given an object (probably request.locals.user),
 *  confirms that it contains the required fields
 *  as specified in `IReqLocalsUserValid`.
 *  This is useful because the middleware that parses
 *  the JWT and sets it may/may not run prior to the
 *  express handler that needs to use it. So this can
 *  help confirm the type of request.locals.user.
 * @param userObj
 * @returns true if the token object contains the expected fields
 */
export const localsUserIsValid = (
  userObj: any
): userObj is TReqLocalsUserValid =>
  !!userObj &&
  stringIsLength(userObj?.userId, 1) &&
  stringIsLength(userObj?.username, 1)

/*
  Middleware that checks if the current request has
  a valid JWT token within their cookies. Will attempt
  to verify it with a the same secret used to sign it.
  
  If there is no JWT, or if it's invalid / unverifiable,
  then the middleware will immediately respond to the client
  and will not allow further middleware / handlers to run.
  
  If the JWT is valid, the payload will be attached to req.locals{}.
*/
export const MiddlewareValidateJWT = (
  req: IRequestWithLocals,
  res: Response,
  next: NextFunction
) => {
  // 1) Find the JWT in the Authorization: Bearer <token> header
  const authHeader = req.headers['authorization']
  const accessToken = authHeader && authHeader.split(' ')[1]

  if (!accessToken) {
    return res.json(
      makeFailedResponse(IErrorCodes.missing_jwt, 'Missing/No Token.')
    )
  }

  // 2) Parse and verify the JWT's expiration
  const { parsedJWT, failedResponse } = ParseJWT(accessToken)

  if (failedResponse) {
    return res.json(failedResponse)
  }

  // 3) Confirm the expected fields were present
  if (!checkJWTFields(parsedJWT)) {
    return res.json(
      makeFailedResponse(
        IErrorCodes.unverified_user,
        'User could not be verified.'
      )
    )
  }

  // 4) Add the JWT fields to request.locals.user
  req.locals = req.locals ?? {}
  req.locals.user = {
    ...(req.locals.user ?? {}),
    userId: parsedJWT.uuid,
    username: parsedJWT.username,
  }

  return next()
}

// ==============================================

type RenewJWTResults = { newJWT: null | string; error: null | string }

export const renewJWT = (oldJWT: string): RenewJWTResults => {
  const results: RenewJWTResults = { newJWT: null, error: null }

  try {
    // Attempt to verify the current (probably expired) JWT.
    // Ignore the expiration date so a "valid" JWT won't
    // throw an exception just because it's expired.
    // It WILL still throw if the signing key is wrong.
    const payload = jwt.verify(oldJWT, process.env.JWT_SIGN_KEY as string, {
      algorithms: ['HS256'],
      ignoreExpiration: true,
    }) as TJWTPayload

    results.newJWT = CreateJWT({
      uuid: payload.uuid,
      username: payload.username,
    } as TJWTPayload)
  } catch (ex: any) {
    console.log('Could not renew JWT', ex?.message)
    results.error = `Could not renew JWT: "${ex?.message}"`
  }

  return results
}

/**
 * Utility to generate and return a JWT string which
 * should contain the data within `payload` as it's
 * payload.
 * @param payload
 * @returns a signed JWT token string containing the passed payload
 */
export const CreateJWT = (payload: TJWTPayload): string => {
  return jwt.sign(payload, process.env.JWT_SIGN_KEY as string, {
    expiresIn: '1800s', // 1800s === 30 minutes
    // expiresIn: '5s', // 1800s === 30 minutes
  })
}
