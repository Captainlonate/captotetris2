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
