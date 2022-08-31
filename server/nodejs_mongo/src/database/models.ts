import mongoose from 'mongoose'

import { Schema_User, Schema_Chat } from './schema'

// ==============================================

export const UserModel = mongoose.model('User', Schema_User)
export const ChatModel = mongoose.model('Chat', Schema_Chat)
