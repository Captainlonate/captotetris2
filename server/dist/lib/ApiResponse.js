"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeSuccessResponse = exports.makeFailedResponse = void 0;
const ApiError_1 = require("./ApiError");
// ==================ApiResponse=====================
class ApiResponse {
    constructor({ data, success, error }) {
        this.data = data;
        this.success = success;
        this.error = error;
    }
}
// ======Utilities for creating ApiResponse=======
const makeFailedResponse = ({ errorCode, message }) => (new ApiResponse({
    success: false,
    data: null,
    error: new ApiError_1.ApiError({
        errorCode,
        message
    })
}));
exports.makeFailedResponse = makeFailedResponse;
const makeSuccessResponse = (data) => (new ApiResponse({
    success: true,
    data,
    error: null
}));
exports.makeSuccessResponse = makeSuccessResponse;
