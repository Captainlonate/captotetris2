/*
  After making a network request, if the server wants to
  communicate that something was not successful, that response
  should be translated into this ApiError object, client side.
*/
export class ApiError extends Error {
  constructor({ message, errorCode }) {
    super(message)
    this.name = this.constructor.name
    this.message = message
    this.errorCode = errorCode
  }
}

export const API_ERRORCODES = {
  auth_wrong_credentials: 'auth_wrong_credentials',
  no_user_found: 'no_user_found',
  unverified_user: 'unverified_user',
  signup_bad_data: 'signup_bad_data',
  signup_existing_user: 'signup_existing_user',
  missing_jwt: 'missing_jwt',
  bad_token: 'bad_token',
  jwt_unknown_user: 'jwt_unknown_user',
  bad_user_input: 'bad_user_input',
  unknown_mongo_error: 'unknown_mongo_error',
  unknown_server_error: 'unknown_server_error',
  expired_jwt: 'expired_jwt',
  cannot_renew_jwt: 'cannot_renew_jwt',
}

export const SOCKETIO_ERRORCODES = {
  JWT_EXPIRED: 'JWT_EXPIRED',
  JWT_MISSING_FIELDS: 'JWT_MISSING_FIELDS',
  JWT_UNVERIFIABLE: 'JWT_UNVERIFIABLE',
  JWT_MISSING: 'JWT_MISSING',
}

export const ERROR_CODES = {
  //
  // Set by the API
  //
  // internal_server: "internal_server",
  //
  // Custom Client Side Interpretations
  //
  non_200: 'non_200',
}
