const SECONDS = 1000

class Timers {
  constructor () {
    this.counter = {
      pieceDrop: 0,
      blockFall: 0,
      blockAnim: 0,
      blockRareAnim: 0,
      pauseBtnAnim: 0,
      drawBorders: 0,
      shatterAnim: 0,
      shattering: 0
    }

    this.duration = {
      blockFrame: Math.floor((3 * SECONDS) / 30),
      pauseBtnFrame: Math.floor((2 * SECONDS) / 30),
      blockRareFrame: 5 * SECONDS,
      pieceDrop: 1 * SECONDS,
      blockFall: 0.05 * SECONDS,
      drawBorders: 1.5 * SECONDS,
      shatterFrame: Math.floor((0.5 * SECONDS) / 30),
      shattering: 0.5 * SECONDS
    }
  }
}

export default Timers
