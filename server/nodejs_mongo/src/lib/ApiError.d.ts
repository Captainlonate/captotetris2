export type ApiErrorCode = string | null

export type ApiResponseMessage = string | null

export interface ApiErrorInput {
  errorCode: ApiErrorCode,
  message: ApiResponseMessage
}