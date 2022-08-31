import express from 'express'

import { ChatsController } from './chats.controller'

// ========================================================

const router = express.Router()

// Get recents chat messages
router.get('/', ChatsController.getRecentChats)

export default router