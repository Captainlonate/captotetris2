# Redis Notes (For Captotetris)

## Redis Docker Container

[Official Page](https://hub.docker.com/_/redis)

## Launcher the docker container

```bash
# While cd'd in this directory
docker-compose -f ./redis_stack.yml up -d
```

## A simple example with nodejs

```js
const redis = require('redis')

const REDIS_DOMAIN = '127.0.0.1'
const REDIS_PORT = '6379'
const REDIS_URL = `redis://${REDIS_DOMAIN}:${REDIS_PORT}`

const client = redis.createClient({ url: REDIS_URL })

client.on('error', (err) => {
  console.log('Redis Client Error', err)
})

async function start () {
  await client.connect();
  await client.set('testkey', 'nathan');
  const value = await client.get('testkeys');
  console.log(`value: ${value}`)

  client.disconnect()
}

start()
```

## Persistent Storage vs Not

__Persistent Storage docker cli command__

```bash
# --save 60 1: save a snapshot of the DB every 60 seconds if at least 1 write operation was performed
# -d: detach mode
docker run --name redis-container -d redis redis-server --save 60 1 --loglevel warning
```

__Possible docker-compose command__

```yml
command: redis-server --save 20 1 --loglevel warning --requirepass eYVX7EwVmmxKPCDmwMtyKVge8oLd2t81
```
_Since this will be used to store live game sessions, persistent storage is not necessary._