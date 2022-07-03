/*
  Express.js app
*/
import cors from 'cors'
import express from 'express'
import cookieParser from 'cookie-parser'

import rootRoutes from './expressRoutes/root/root.router'
import userRoutes from './expressRoutes/users/users.router'
import chatRoutes from './expressRoutes/chats/chats.router'
import gameRoutes from './expressRoutes/game/game.router'

// ========================================================

const app = express()

// Middlware
app.use(cors({ origin: true, credentials: true }))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cookieParser())

// Routes
app.use('/', rootRoutes)
app.use('/users', userRoutes)
app.use('/chats', chatRoutes)
app.use('/game', gameRoutes)

export default app