"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const ApiResponse_1 = require("../../lib/ApiResponse");
const SessionStore_1 = __importDefault(require("../../lib/SessionStore"));
class UserController {
    static getAllUsers(req, res) {
        const allUsers = SessionStore_1.default.findAllSessions();
        res.json((0, ApiResponse_1.makeSuccessResponse)(allUsers));
    }
}
exports.UserController = UserController;
