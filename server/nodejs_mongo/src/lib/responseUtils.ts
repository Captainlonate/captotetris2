type IResponseErrorCode = string | undefined | null
type IResponseMessage = string | undefined | null
type IResponseError = any

interface ISuccessResponse {}

export interface IFailedResponse {
  success: boolean
  data: null
  error: {
    error_code: IErrorCodes | undefined | null
    human_msg: IResponseMessage
    err: IResponseError
  }
}

export enum IErrorCodes {
  auth_wrong_credentials = 'auth_wrong_credentials',
  no_user_found = 'no_user_found',
  unverified_user = 'unverified_user',
  signup_bad_data = 'signup_bad_data',
  signup_existing_user = 'signup_existing_user',
  missing_jwt = 'missing_jwt',
  bad_token = 'bad_token',
  jwt_unknown_user = 'jwt_unknown_user',
  bad_user_input = 'bad_user_input',
  unknown_mongo_error = 'unknown_mongo_error',
  unknown_server_error = 'unknown_server_error',
  expired_jwt = 'expired_jwt',
  cannot_renew_jwt = 'cannot_renew_jwt',
}

export enum SOCKETIO_ERROR_CODES {
  JWT_EXPIRED = 'JWT_EXPIRED',
  JWT_MISSING_FIELDS = 'JWT_MISSING_FIELDS',
  JWT_UNVERIFIABLE = 'JWT_UNVERIFIABLE',
  JWT_MISSING = 'JWT_MISSING',
}

/*
  Convenience method for creating an API Response that
  contains a failure.
*/
export const makeFailedResponse = (
  errorCode: IErrorCodes | undefined | null,
  message: IResponseMessage,
  err: IResponseError = null
): IFailedResponse => ({
  success: false,
  error: {
    error_code: errorCode,
    human_msg: message,
    err,
  },
  data: null,
})

export const makeSuccessResponse = (data: any): ISuccessResponse => ({
  success: true,
  error: null,
  data,
})
