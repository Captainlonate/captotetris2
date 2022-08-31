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
