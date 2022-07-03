"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatsController = void 0;
const ApiResponse_1 = require("../../lib/ApiResponse");
const ChatsStore_1 = __importDefault(require("../../database/ChatsStore"));
// ========================================================
class ChatsController {
    static getRecentChats(req, res) {
        const recentChatMessages = ChatsStore_1.default.getRecentChats(30);
        res.json((0, ApiResponse_1.makeSuccessResponse)(recentChatMessages));
    }
}
exports.ChatsController = ChatsController;
