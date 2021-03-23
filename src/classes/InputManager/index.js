class InputManager {
  constructor () {
    this._monitoredEvents = {}
  }

  on (eventKey, eventCallback) {
    if (typeof eventCallback === 'function') {
      this._monitoredEvents[eventKey] = this._monitoredEvents[eventKey] || []
      this._monitoredEvents[eventKey].push(eventCallback)
    }
  }

  fire (eventKey) {
    if (Array.isArray(this._monitoredEvents[eventKey])) {
      for (const callback of this._monitoredEvents[eventKey]) {
        callback()
      }
    }
  }

  handleKeyUp (keyCode) {
    switch (keyCode) {
      case 87: // W
      case 38: // Up Arrow
        this.fire('up')
        break
      case 83: // S
      case 40: // D Arrow
        this.fire('down')
        break
      case 65: // A
      case 37: // L Arrow
        this.fire('left')
        break
      case 32: // SpaceBar
        this.fire('space')
        break
      case 68: // D
      case 39: // R Arrow
        this.fire('right')
        break
      default:
        break
    }
  }
}

export default InputManager
