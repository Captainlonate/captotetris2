import { makeRandomID } from '../lib/utils'

// ========================================================

interface ChatConstructorInput {
  authorName: string,
  authorUserID: string,
  message: string,
}

export class ChatMessage {
  authorName: string;
  authorUserID: string;
  message: string;
  id: string;
  time: number;

  constructor ({ authorName, authorUserID, message }: ChatConstructorInput) {
    this.authorName = authorName
    this.authorUserID = authorUserID
    this.message = message
    this.id = makeRandomID()
    this.time = Date.now()
  }

  // toJSON (): object {
  //   return {
  //     authorName: this.authorName,
  //     authorUserID: this.authorUserID,
  //     message: this.message,
  //     id: this.id,
  //     time: this.time,
  //   }
  // }
}

class ChatsStore {
  private chats: ChatMessage[];

  constructor() {
    this.chats = []

    const seedMessages = [
      { authorUserID: '0001', authorName: 'Maximus Decimus Meridius', message: 'Is anyone here?' },
      { authorUserID: '0002', authorName: 'Emporer Commodus', message: 'Yeah, I\'m here.' },
      { authorUserID: '0003', authorName: 'Maximus Decimus Meridius', message: 'Want to play?' },
      { authorUserID: '0004', authorName: 'Emporer Commodus', message: 'Let\'s go!' },
      { authorUserID: '0005', authorName: 'Emporer Commodus', message: 'Waiting...' }
    ]
    seedMessages.forEach((seedMessage) => {
      this.chats.push(new ChatMessage(seedMessage))
    })
  }

  addChat (chatMessage: ChatMessage) {
    this.chats.push(chatMessage)
  }

  getRecentChats (howMany: number = 20): ChatMessage[] {
    return this.chats.slice(-howMany)
  }
}

const ChatsStoreSingleton = new ChatsStore()

export default ChatsStoreSingleton