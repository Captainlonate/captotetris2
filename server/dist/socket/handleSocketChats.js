"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handlePostChatMessage = void 0;
const SocketIOEvents_1 = require("../lib/SocketIOEvents");
const ChatsStore_1 = __importStar(require("../database/ChatsStore"));
// ========================================================
const handlePostChatMessage = (socketIOServer, socket) => {
    socket.on(SocketIOEvents_1.SOCKET_EVENTS.C2S.POST_CHAT_MESSAGE, (chatMessage) => __awaiter(void 0, void 0, void 0, function* () {
        if (!socket.userID || !socket.sessionID || !socket.userName) {
            return;
        }
        const newChatMessage = new ChatsStore_1.ChatMessage({
            authorName: socket.userName,
            authorUserID: socket.userID,
            message: chatMessage
        });
        ChatsStore_1.default.addChat(newChatMessage);
        socketIOServer.emit(SocketIOEvents_1.SOCKET_EVENTS.S2C.NEW_CHAT_MESSAGE, newChatMessage);
    }));
};
exports.handlePostChatMessage = handlePostChatMessage;
