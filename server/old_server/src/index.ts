import http from 'http'
import dotenv from 'dotenv'

import expressApp from './expressApp'
import { attachSocketIOServerToHttpServer } from './socketioServer'

// ===================================================

// Load the .env file into process.env
dotenv.config()

// ExpressJS Server
const httpServer = http.createServer(expressApp)

// SocketIO Server
attachSocketIOServerToHttpServer(httpServer)

// ===================================================

httpServer.listen(process.env.EXPRESS_PORT, () => {
  console.log(`Listening on http://localhost:${process.env.EXPRESS_PORT}`)
})