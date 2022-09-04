export const makeDBConnString = ({
  dbUserName,
  dbPassword,
  dbMongoHost,
  dbMongoPort,
  dbDBName,
}: {
  dbUserName: string
  dbPassword: string
  dbMongoHost: string
  dbMongoPort: string
  dbDBName: string
}): string =>
  `mongodb://${dbUserName}:${dbPassword}@${dbMongoHost}:${dbMongoPort}/${dbDBName}?authSource=admin`
// `mongodb://${dbUserName}:${dbPassword}@${dbMongoHost}:${dbMongoPort}`

export const makeRedisConnString = ({
  redisHost,
  redisPort,
}: {
  redisHost: string
  redisPort: string
}): string => `redis://${redisHost}:${redisPort}`
