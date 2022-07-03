"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const chats_controller_1 = require("./chats.controller");
// ========================================================
const router = express_1.default.Router();
// Get recents chat messages
router.get('/', chats_controller_1.ChatsController.getRecentChats);
exports.default = router;
