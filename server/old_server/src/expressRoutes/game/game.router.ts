import express from 'express'

import { GameController } from './game.controller'

// ========================================================

const router = express.Router()

router.post('/break', GameController.handleBreak)

export default router