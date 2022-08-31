import express from 'express'

import { UserController } from './users.controller'

// ========================================================

const router = express.Router()

// Get all users
router.get('/', UserController.getAllUsers)

export default router