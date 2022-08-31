import http from 'http'
import dotenv from 'dotenv'

import expressApp from './expressApp'
import { attachSocketIOServerToHttpServer } from './socketioServer'

// ===================================================

// Load the .env file into process.env
const dotenvLoadResult = dotenv.config()
if (dotenvLoadResult.error) {
  if (dotenvLoadResult.error.message) {
    console.log(`Error loading the .env file: "${dotenvLoadResult.error.message}"`)
  }
  throw dotenvLoadResult.error
}

// ExpressJS Server
const httpServer = http.createServer(expressApp)

// SocketIO Server
attachSocketIOServerToHttpServer(httpServer)

// ===================================================

httpServer.listen(process.env.EXPRESS_PORT, () => {
  console.log(`NODE_ENV: ${process.env.NODE_ENV}`)
  console.log(`Listening on http://localhost:${process.env.EXPRESS_PORT}`)
})