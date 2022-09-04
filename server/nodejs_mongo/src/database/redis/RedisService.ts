import { createClient } from 'redis'
import { makeRedisConnString } from '../utils'

// let redisClient = null

// const redisErrorHandler = (err: any) => {
//   console.log('Redis:: Client Error', err)
// }

// export const setUpRedis = (connectionString: string) => {
//   redisClient = createClient({
//     url: connectionString,
//   })

//   redisClient.on('error', redisErrorHandler)
// }

const CONFIG = {
  redis: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    connectionString: makeRedisConnString({
      redisHost: process.env.REDIS_HOST ?? 'localhost',
      redisPort: process.env.REDIS_PORT ?? '6379',
    }),
  },
}

/**
 * Let this serve as a singleton.
 * Any file can import this client.
 * Express Server won't start unless a redis connection
 * is established, so it can be reliably used.
 */
export const redisClient = createClient({
  url: CONFIG.redis.connectionString,
})

redisClient.on('connect', (err) => {
  console.log(
    'Redis:: Ev(connect): The client is initiating a connection to the server.'
  )
})

redisClient.on('error', (err) => {
  console.log('Redis:: Ev(error): Client Error', err, err?.type)
  process.exit(1)
})

redisClient.on('ready', () => {
  console.log(
    'Redis:: Ev(ready): The client successfully initiated the connection to the server.'
  )
})

redisClient.on('end', () => {
  console.log(
    'Redis:: Ev(end): The client disconnected the connection to the server via .quit() or .disconnect().'
  )
})

redisClient.on('reconnecting', () => {
  console.log(
    'Redis:: Ev(reconnecting): The client is trying to reconnect to the server.'
  )
})

const r = {
  'challenge:nathan': {
    '>mammaw': 'pending',
    '<mom': 'pending',
  },

  // "challenge:mammaw": {
  //   "<nathan": "pending"
  // },

  'challenge:mom': {
    '>nathan': 'pending',
  },

  'challenge:nathan:from': [],
  'challenge:nathan:to': [],

  // Who has mammaw challenged
  'challenge:from:mammaw': {
    nathan: 'pending',
    mom: 'pending',
  },

  // Who has challenged mammaw
  'challenge:to:nathan': {
    mammaw: 'pending',
  },

  /*
    Who have I challenged?

    Who has challenged me?
  */
}

Object.keys({
  nathan: 'pending',
  mom: 'pending',
}).map((userName) => {})

/**
 *
 */
class RedisService {
  // static async CreateChallenge(challengerId: string, challengeeId: string) {
  //   if (redisClient.isReady) {
  //     const fromTo = `challenge:${challengerId}>${challengeeId}`
  //     const toFrom = `challenge:${challengeeId}<${challengerId}`

  //     await redisClient.set(fromTo, 'pending')
  //     await redisClient.set(toFrom, 'pending')
  //   }
  // }
  static async CreateChallenge(challengerId: string, challengeeId: string) {
    if (redisClient.isReady) {
      const fromTo = `${challengerId}>${challengeeId}`
      const toFrom = `${challengeeId}<${challengerId}`

      await redisClient.hSet('challenge', fromTo, 'pending')
      await redisClient.hSet('challenge', toFrom, 'pending')
    }
  }
  static async GetChallenge(challengerId: string, challengeeId: string) {
    if (redisClient.isReady) {
      const fromTo = `challenge:${challengerId}>${challengeeId}`
      const toFrom = `challenge:${challengeeId}<${challengerId}`

      // If it's not found, it will be null.
      const fT = await redisClient.get(fromTo)
      const tF = await redisClient.get(toFrom)

      return { fT, tF }
    }
  }
  static async GetAllChallenges() {
    if (redisClient.isReady) {
      // If it's not found, it will be null.
      const allChallenges = await redisClient.hGetAll('challenge')

      // const allChallengesByKey = await redisClient.hGetAll('')

      return allChallenges
    }
  }
}

export default RedisService
