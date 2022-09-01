import express from 'express'

import { UserController } from './users.controller'
import { MiddlewareValidateJWT } from '../../lib/middleware/jwt'

// ========================================================

const router = express.Router()

// Get all users
router.get('/', UserController.getAllUsers)
router.get('/online', UserController.getAllConnectedUsers)

// Get logged in user (from JWT)
router.get('/me', MiddlewareValidateJWT, UserController.getMe)

export default router
