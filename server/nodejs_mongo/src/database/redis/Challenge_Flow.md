# Player Challenges Another Logic Flow

Flow of challenge logic between two players: "Nathan" and "Lucca"

## Nathan challenges Lucca

Nathan clicks the Challenge Button next to Lucca.

**Nathan's Client Emits:**

```json
{
  "event": "challenge_to",
  "payload": {
    "challengee": "LuccaID"
  }
}
```

## Next

The server generates a new `matchID`

```js
const matchId = generateMatchId()
```

Server creates this structure in Redis:

```json
{
  "match:matchId": {
    "challengerID": "NathanID",
    "challengeeID": "LuccaID",
    "ready:NathanID": "false",
    "ready:LuccaID": "false",
    "matchBegan": "false"
  }
}
```

Using this pseudoCode:

```js
await redisClient.hset(
  `match:${matchId}`,
  'challengerID',
  '< NathanID >',
  'challengeeID',
  '< LuccaID >',
  'ready:NathanID',
  'false',
  'ready:LuccaID',
  'false',
  'matchBegan',
  'false'
)
// TODO: Set TTL on this to 3hours?
```

**If either player logs out, need a way to link `LuccaID` to `matchId`??? But the clients will know that `LuccaID` is offline, and will reset their buttons. Any new challenges will generate new `matchID`'s.**

**Server emits to Lucca:**

```json
{
  "event": "new_challenge",
  "payload": {
    "matchId": "matchId",
    "challenger": "NathanID"
  }
}
```

## Next

Lucca accepts the challenge by clicking "Accept".

**Lucca's Client Emits:**

```json
{
  "event": "challenge_accept",
  "payload": {
    "matchId": "matchId"
  }
}
```

## Next

The server just received `challenge_accept` from Lucca's socket.

The server checks Redis for that match ID:

```js
const matchInfo = await redisClient.hGetAll(`match:${matchID}`)

if (matchInfo && matchInfo.challengeeID === luccaID) {
  // Then we know this is a valid matchId.
  // This way you can't just "accept" a match against
  // someone who didn't challenge you.
  // Now the server can emit "challenge_start" to both.
}
```

Then, the server emits to both Nathan and Lucca:

```json
"challenge_start": {
  matchId: "abcd1234",
  challenger: {
    id: "NathanID",
    userName: "Nathan"
  },
  challengee: {
    id: "LuccaID",
    userName: "Lucca"
  }
}
```

## Next

After receiving `challenge_start`, each client loads the game.

Both clients show a modal, which looks like:

```
    Nathan vs Lucca

    0/2 players ready

    [Ready]   [Resign]
```

When each player clicks "Ready", their Client Emits:

```json
{
  "event": "player_ready",
  "payload": {
    "matchId": "abcd1234"
  }
}
```

## Next

When the server receives `player_ready`, it updates Redis
with the following pseudocode:

```js
// 1) Fetch current matchInfo for the given matchID
const matchInfo = await redisClient.hGetAll(`match:${matchID}`)

// 2) Confirm that the matchID is real
if (matchInfo) {
  const userIsChallenger = matchInfo.challengerID === userID
  const userIsChallengee = matchInfo.challengeeID === userID
  // 3) Ensure this is a valid matchID, and the player
  // actually belongs to that match. (safety check)
  if (userIsChallenger || userIsChallengee) {
    // 4) Determine if the other player is already ready.
    // If the other player is ready, then the match can start
    const otherPlayerID =
      matchInfo[userIsChallenger ? 'challengeeID' : 'challengerID']
    const isOtherPlayerReady = matchInfo[`ready:${otherPlayerID}`] === 'true'

    if (isOtherPlayerReady) {
      // Set that this player is ready, and the match has started....
      await redisClient.hSet(
        `match:${matchID}`,
        `ready:${userID}`,
        'true'`matchBegan`,
        'true'
      )

      /*
        The server puts both players in the same SocketIO room,
        named the `matchId`. All game events include the `matchId`, so the server knows where to emit the events.
      */

      // The server emits that the game can start...
    } else {
      // Just set that this player is ready.
      await redisClient.hSet(`match:${matchID}`, `ready:${userID}`, 'true')
    }
  }
}
```

When both players are ready, the server emits to the room with `matchId`:

```json
{
  "event": "match_started",
  "payload": {
    "matchId": "matchId"
  }
}
```

## Next

When each client receives `match_started`, the modal disappears and the game begins.

All game events must include the `matchID`. The SocketIO server emits the events to the room with that name.
