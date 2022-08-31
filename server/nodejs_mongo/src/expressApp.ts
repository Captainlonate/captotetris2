/*
  Express.js app
*/
import cors from 'cors'
import express from 'express'
import cookieParser from 'cookie-parser'
import helmet from 'helmet'

import rootRoutes from './expressRoutes/root/root.router'
import userRoutes from './expressRoutes/users/users.router'
import chatRoutes from './expressRoutes/chats/chats.router'
import authRoutes from './expressRoutes/auth/auth.router'

// ========================================================

process.title = 'service_node_auth'

const app = express()

// Middleware
app.use(helmet())
app.use(cors({ origin: true, credentials: true }))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cookieParser())

// Routes
app.use('/', rootRoutes)
app.use('/users', userRoutes)
app.use('/chats', chatRoutes)
app.use('/auth', authRoutes)

export default app
