import { ApiError, ApiErrorCode, ApiResponseMessage } from './ApiError'

// ========================================================

export interface ApiResponseInput {
  data: any,
  success: boolean,
  error: ApiError | null
}

export interface FailedResponseInput {
  errorCode: ApiErrorCode,
  message: ApiResponseMessage
}