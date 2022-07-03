import { ApiError } from './ApiError'
import { ApiResponseInput, FailedResponseInput } from './ApiResponse.d'

// ==================ApiResponse=====================

class ApiResponse {
  data: any | null;
  success: boolean;
  error: ApiError | null;

  constructor ({ data, success, error }: ApiResponseInput) {
    this.data = data
    this.success = success
    this.error = error
  }
}

// ======Utilities for creating ApiResponse=======

export const makeFailedResponse = ({ errorCode, message }: FailedResponseInput) => (
  new ApiResponse({
    success: false,
    data: null,
    error: new ApiError({
      errorCode,
      message
    })
  })
)

export const makeSuccessResponse = (data: any) => (
  new ApiResponse({
    success: true,
    data,
    error: null
  })
)