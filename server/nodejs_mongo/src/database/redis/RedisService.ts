import { createClient } from 'redis'
import { makeRedisConnString } from '../utils'

const CONFIG = {
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  connectionString: makeRedisConnString({
    redisHost: process.env.REDIS_HOST ?? 'localhost',
    redisPort: process.env.REDIS_PORT ?? '6379',
  }),
  matchExpirationSeconds: 60 * 60 * 2,
}

/**
 * Let this serve as a singleton.
 * Any file can import this client.
 * Express Server won't start unless a redis connection
 * is established, so it can be reliably used.
 */
export const redisClient = createClient({
  url: CONFIG.connectionString,
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

/**
 *
 */
class RedisService {
  /**
   * Creates a challenge hash in redis.
   * The key will be like: `match:${matchID}`
   * @param matchID The match ID, NOT the hash key. The hash
   *                key will be created for you.
   * @param challengerId MongoDB userID for the challenger
   * @param challengeeId MongoDB userID for the challengee
   * @returns An error message, if one occurred. Otherwise null.
   */
  static async CreateChallenge(
    matchID: string,
    challengerId: string,
    challengeeId: string
  ) {
    // const results: { error: any } = { error: null }
    let error: null | string = null
    const matchKey = `match:${matchID}`

    if (redisClient.isReady) {
      try {
        // Creates the hash if it doesn't exist
        const numberOfFieldsAdded = await redisClient.hSet(
          // Key
          matchKey,
          // Hash Fields
          {
            challengerID: challengerId,
            challengeeID: challengeeId,
            [`ready:${challengerId}`]: 'false',
            [`ready:${challengeeId}`]: 'false',
            matchBegan: 'false',
          }
        )
        // Auto-expire the entire hash after some time
        await redisClient.expire(
          `match:${matchID}`,
          CONFIG.matchExpirationSeconds
        )

        console.log(
          `Redis::Added ${numberOfFieldsAdded} fields to "match:${matchID}"`
        )
      } catch (ex: any) {
        console.log(
          'RedisService::CreateChallenge()::Error when creating challenge',
          { matchID, challengerId, challengeeId },
          ex
        )
        error = ex?.message ?? 'Error creating challenge.'
      }
    } else {
      error =
        'RedisService::CreateChallenge()::Error Redis Client was not ready.'
    }

    return error
  }

  /**
   * Fetch one match hash from Redis based on the matchID.
   * @param matchID The match ID, NOT the hash key. The hash
   *                key will be created for you.
   */
  static async GetChallengeByMatchID(matchID: string) {
    const results: { data: any; error: any } = { data: null, error: null }
    const matchKey = `match:${matchID}`

    if (redisClient.isReady) {
      try {
        const matchObject = await redisClient.hGetAll(matchKey)
        if (!matchObject) {
          results.error = `Could not find match: "${matchKey}".`
        } else {
          results.data = matchObject
        }
      } catch (ex: any) {
        console.log(
          'RedisService::GetChallenge()::Error when fetching challenge',
          { matchKey },
          ex
        )
        results.error = ex?.message ?? `Error fetching match "${matchKey}".`
      }
    } else {
      results.error =
        'RedisService::GetChallenge()::Error Redis Client was not ready.'
    }

    return results
  }

  /**
   *
   * @param matchID
   */
  static async DeleteChallengeByMatchId(matchID: string) {
    try {
      await redisClient.del(`match:${matchID}`)
    } catch (ex: any) {
      console.log(
        'RedisService::DeleteChallengeByMatchId()::Error deleting match.',
        ex?.message
      )
    }
  }

  /**
   *
   * @param matchID
   * @param userID
   * @returns
   */
  static async SetPlayerReady(matchID: string, userID: string) {
    let error: string | null = null

    try {
      await redisClient.hSet(`match:${matchID}`, `ready:${userID}`, 'true')
    } catch (ex: any) {
      console.log(
        'RedisService::SetPlayerReady()::Error setting player read for match.',
        ex?.message
      )
      error = ex?.message
    }

    return error
  }

  /**
   *
   * @param matchID
   * @returns
   */
  static async SetMatchBegan(matchID: string) {
    let error: string | null = null

    try {
      await redisClient.hSet(`match:${matchID}`, 'matchBegan', 'true')
    } catch (ex: any) {
      console.log(
        'RedisService::SetMatchBegan()::Error setting the match began.',
        ex?.message
      )
      error = ex?.message
    }

    return error
  }

  /**
   *
   * @returns
   */
  // static async GetAllChallengeInfoForUser(challengerID: string) {
  //   const results: { data: any; error: any } = { data: null, error: null }

  //   if (redisClient.isReady) {
  //     try {
  //       s
  //     } catch (ex: any) {
  //       console.log(
  //         'RedisService::GetAllChallengeInfoForUser()::Error when fetching challenge info for user.',
  //         { challengerID },
  //         ex
  //       )
  //       results.error =
  //         ex?.message ?? 'Error Fetching challenge info for user..'
  //     }
  //   } else {
  //     results.error =
  //       'RedisService::GetAllChallengeInfoForUser()::Error Redis Client was not ready.'
  //   }

  //   return results
  // }
}

export default RedisService
