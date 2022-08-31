import {
  ApiErrorCode,
  ApiResponseMessage,
  ApiErrorInput
} from './ApiError.d'

// ========================================================

export class ApiError {
  errorCode: ApiErrorCode;
  message: ApiResponseMessage;

  constructor ({ errorCode, message }: ApiErrorInput) {
    this.errorCode = errorCode
    this.message = message
  }
}

export const SOCKETIO_ERROR_CODES = {
  EXPIRED_SESSION: 'expired_session'
}