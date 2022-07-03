"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SOCKETIO_ERROR_CODES = exports.ApiError = void 0;
// ========================================================
class ApiError {
    constructor({ errorCode, message }) {
        this.errorCode = errorCode;
        this.message = message;
    }
}
exports.ApiError = ApiError;
exports.SOCKETIO_ERROR_CODES = {
    EXPIRED_SESSION: 'expired_session'
};
