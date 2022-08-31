import express from 'express'

import { MiddlewareValidateJWT } from '../../lib/middleware/jwt'
import { ChatsController } from './chats.controller'

// ========================================================

const router = express.Router()

// Get recents chat messages
router.get('/', MiddlewareValidateJWT, ChatsController.getRecentChats)

// Create one chat message
router.post('/', MiddlewareValidateJWT, ChatsController.createChat)

export default router
