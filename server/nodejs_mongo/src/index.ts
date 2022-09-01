import http from 'http'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import { Server, Socket } from 'socket.io'

import expressApp from './expressApp'
import { makeDBConnString } from './database/utils'
import { stringIsLength } from './lib/validators'
import { attachSocketIOServerToHttpServer } from './socketioServer'

// ===================================================

// Load the .env file into process.env
dotenv.config()

const CONFIG = {
  listen: {
    port: process.env.EXPRESS_PORT,
  },
  db: {
    host: process.env.MONGO_HOST,
    port: process.env.MONGO_PORT,
    connectionString: makeDBConnString({
      dbMongoHost: process.env.MONGO_HOST ?? 'localhost',
      dbUserName: process.env.MONGO_USERNAME ?? '',
      dbMongoPort: process.env.MONGO_PORT ?? '',
      dbPassword: process.env.MONGO_PASSWORD ?? '',
      dbDBName: process.env.MONGO_DATABASE ?? '',
    }),
  },
  requiredEnvVars: [
    'EXPRESS_PORT',
    'JWT_SIGN_KEY',
    'MONGO_USERNAME',
    'MONGO_PASSWORD',
    'MONGO_HOST',
    'MONGO_PORT',
    'MONGO_DATABASE',
  ],
}

const allEnvVarsFound = CONFIG.requiredEnvVars.every((key) =>
  stringIsLength(process?.env[key], 1)
)

// ===================================================

// ExpressJS Server
const httpServer = http.createServer(expressApp)

// SocketIO Server
const socketIOServer = attachSocketIOServerToHttpServer(httpServer)
// type TSocketIOS = Server
expressApp.set('socketios', socketIOServer)
// ===================================================

async function run() {
  try {
    // Connect to MongoDB
    await mongoose.connect(CONFIG.db.connectionString)
    console.log(
      `Successfully connected to MongoDB on "${CONFIG.db.host}:${CONFIG.db.port}"`
    )

    // If the MongoDB connection was successful, then start
    // the HTTP API
    httpServer.listen(CONFIG.listen.port, () => {
      console.log(`Listening on http://localhost:${CONFIG.listen.port}`)
    })
  } catch (ex: any) {
    console.log('-------------------------------------------')
    console.error('Error connecting to MongoDB', ex?.message)
    console.log('-------------------------------------------')
    process.exit(1)
  }
}

if (allEnvVarsFound) {
  run()
} else {
  console.error(
    'Missing environment variables. Required:',
    CONFIG.requiredEnvVars
  )
}
