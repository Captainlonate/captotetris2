"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatsController = void 0;
const ApiResponse_1 = require("../../lib/ApiResponse");
const InMemoryChatsStore = [];
class ChatsController {
    static getRecentChats(req, res) {
        res.json((0, ApiResponse_1.makeSuccessResponse)(InMemoryChatsStore.slice(-30)));
    }
}
exports.ChatsController = ChatsController;
