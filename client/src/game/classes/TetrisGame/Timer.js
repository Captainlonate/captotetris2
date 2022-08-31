/*
  A timer has a counter. As it is incremented, it will approach
  a specified duration. Once it exceeds that duration, the timer
  will reset back to zero.
  Use 'updateAndCheck()' to increment the timer, and check if
  it has been reset by this new addition.

  This is primarily used for updating animation frames where
  requestAnimationFrame adds ~16ms each call, and once a frame's
  duration has elapsed (say 200ms), then the next animation frame
  should be played and the timer should restart.
*/
class Timer {
  constructor ({ duration }) {
    this.counter = 0
    this.duration = duration || 0
  }

  updateAndCheck (deltaTime) {
    this.counter += deltaTime
    if (this.counter > this.duration) {
      this.counter = 0
      return true
    }
    return false
  }

  reset () {
    this.counter = 0
  }

  percentDone () {
    return (this.counter / this.duration)
  }
}

// number of ms in a second
export const SECONDS = 1000

export default Timer
