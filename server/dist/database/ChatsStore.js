"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatMessage = void 0;
const utils_1 = require("../lib/utils");
class ChatMessage {
    constructor({ authorName, authorUserID, message }) {
        this.authorName = authorName;
        this.authorUserID = authorUserID;
        this.message = message;
        this.id = (0, utils_1.makeRandomID)();
        this.time = Date.now();
    }
}
exports.ChatMessage = ChatMessage;
class ChatsStore {
    constructor() {
        this.chats = [];
        const seedMessages = [
            { authorUserID: '0001', authorName: 'Maximus Decimus Meridius', message: 'Is anyone here?' },
            { authorUserID: '0002', authorName: 'Emporer Commodus', message: 'Yeah, I\'m here.' },
            { authorUserID: '0003', authorName: 'Maximus Decimus Meridius', message: 'Want to play?' },
            { authorUserID: '0004', authorName: 'Emporer Commodus', message: 'Let\'s go!' },
            { authorUserID: '0005', authorName: 'Emporer Commodus', message: 'Waiting...' }
        ];
        seedMessages.forEach((seedMessage) => {
            this.chats.push(new ChatMessage(seedMessage));
        });
    }
    addChat(chatMessage) {
        this.chats.push(chatMessage);
    }
    getRecentChats(howMany = 20) {
        return this.chats.slice(-howMany);
    }
}
const ChatsStoreSingleton = new ChatsStore();
exports.default = ChatsStoreSingleton;
