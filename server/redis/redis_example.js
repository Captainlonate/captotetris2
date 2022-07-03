const redis = require('redis')

// =============================================

// const REDIS_USER = ''
// const REDIS_PASSWORD = 'localhostredispass'
const REDIS_DOMAIN = '127.0.0.1'
const REDIS_PORT = '6379'
const REDIS_URL = `redis://${REDIS_DOMAIN}:${REDIS_PORT}`
// const REDIS_URL = `redis://${REDIS_USER}:${REDIS_PASSWORD}@${REDIS_DOMAIN}:${REDIS_PORT}`

// =============================================

const BLOCKS = {
  EMPTY: 'E',
  CEMENT: 'C',

  RED_BLOCK: 'r',
  RED_BREAKER: 'R',
  RED_CEMENT: 'rc',
  RED_CEMENT_VISIBLE: 'rv',

  GREEN_BLOCK: 'g',
  GREEN_BREAKER: 'G',
  GREEN_CEMENT: 'gc',
  GREEN_CEMENT_VISIBLE: 'gv',
  
  BLUE_BLOCK: 'b',
  BLUE_BREAKER: 'B',
  BLUE_CEMENT: 'bc',
  BLUE_CEMENT_VISIBLE: 'bv',
  
  YELLOW_BLOCK: 'y',
  YELLOW_BREAKER: 'Y',
  YELLOW_CEMENT: 'yc',
  YELLOW_CEMENT_VISIBLE: 'yv',
}

const NUMROWS = 15
const NUMCOLS = 7

const DELIMITER = ','

// Initialize 2d array with empty blocks
let data = (
  (new Array(NUMROWS))
    .fill(0)
    .map(() => 
      new Array(NUMCOLS).fill(BLOCKS.EMPTY)
    )
)

/*

*/
const array2dToString = (array2D) => array2D.flat().join(DELIMITER)

/*

*/
const stringTo2dArray = (str, delimiter, cellsPerRow = 1) => (
  str.split(delimiter).reduce((acc, el, idx) => {
    if (idx % cellsPerRow === 0) {
      acc.push([])
    }
    acc[acc.length - 1].push(el)
    return acc
  }, [])
)

/*

*/
const updateStringCell = (str = '', operations = []) => {
  const elsPerRow = 5

  const asArray = str.split(DELIMITER)
  
  for (let { rowIdx, cellIdx, newVal } of operations) {
    const index = (elsPerRow * rowIdx) + cellIdx
    asArray[index] = newVal
  }

  return asArray.join(DELIMITER)
}

const client = redis.createClient({ url: REDIS_URL })

client.on('error', (err) => {
  console.log('Redis Client Error', err)
})

(async () => {
  console.log('client', client)
  // await client.connect()
  // const boardAsString = array2dToString(data)
  // await client.set('pOne+pTwo', boardAsString)
  // const value = await client.get('pOne+pTwo')
  // console.log(`value:`, stringTo2dArray(value, DELIMITER, NUMCOLS))
  // client.disconnect()
})();
// start()