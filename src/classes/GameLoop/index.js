class GameLoop {
  constructor (canvasRef, boundingRef) {
    this.canvasEl = canvasRef.current
    this.gameArea = boundingRef.current
    this._ctx = this.canvasEl.getContext('2d')

    this.canvasWidth = this.canvasEl.width
    this.canvasHeight = this.canvasEl.height

    this.game = null

    this.deltaTime = 0
    this.timeLastUpdate = 0

    this.onWindowResize()

    window.addEventListener('resize', this.onWindowResize)
    window.addEventListener('keydown', this.onKeyDown)
    window.addEventListener('focus', this.onTabFocus)
    window.addEventListener('blur', this.onTabBlur)

    this.canvasEl.addEventListener('mouseup', this.onClick)
  }

  updateCanvasBounds () {
    this.canvasWidth = this.canvasEl.width
    this.canvasHeight = this.canvasEl.height
    this.onWindowResize()
  }

  setGame = (GameClass) => {
    this.game = new GameClass({ ctx: this._ctx })
    this.onWindowResize()
  }

  clearCanvas () {
    // Clear the entire canvas
    this._ctx.clearRect(0, 0, this._ctx.canvas.width, this._ctx.canvas.height)
    // Fill the canvas with a dark, tinted background to increase contrast
    // this._ctx.fillStyle = '#4ec8ff' // with 20% opacity - looks like a window
    this._ctx.fillStyle = '#002d42'
    this._ctx.globalAlpha = 0.8
    this._ctx.fillRect(0, 0, this._ctx.canvas.width, this._ctx.canvas.height)
    this._ctx.globalAlpha = 1.0
  }

  draw = () => {
    this.clearCanvas()
    this.game.draw()
  }

  start = () => {
    if (this.game) {
      this.gameLoop(0)
    } else {
      console.warn('No Game was set in the loop.')
    }
  }

  gameLoop = (timestamp) => {
    this.deltaTime = timestamp - this.timeLastUpdate
    this.timeLastUpdate = timestamp

    if (this.game) {
      this.game.update(this.deltaTime)
      this.draw()
      window.requestAnimationFrame(this.gameLoop)
    }
  }

  onWindowResize = () => {
    const { height: gameAreaHeight } = this.gameArea.getBoundingClientRect()

    const maxBlockHeight = Math.floor(gameAreaHeight / 13)
    const maxBlockWidth = maxBlockHeight

    const leftSidebarWidth = maxBlockWidth * 2
    const boardWidth = maxBlockWidth * 7
    const newCanvasHeight = maxBlockHeight * 13
    const newCanvasWidth = boardWidth + leftSidebarWidth

    this.canvasWidth = newCanvasWidth
    this.canvasHeight = newCanvasHeight

    this.canvasEl.width = newCanvasWidth * window.devicePixelRatio
    this.canvasEl.height = newCanvasHeight * window.devicePixelRatio

    this.canvasEl.style.width = newCanvasWidth + 'px'
    this.canvasEl.style.height = newCanvasHeight + 'px'

    this._ctx.scale(window.devicePixelRatio, window.devicePixelRatio)

    if (this.game) {
      this.game.updateCanvasBounds(newCanvasWidth, newCanvasHeight, leftSidebarWidth, boardWidth)
    }
  }

  onKeyDown = (e) => {
    if (this.game) {
      this.game.onKeyPressed(e.keyCode)
    }
  }

  onTabFocus = () => {
    if (this.game) {
      this.game.onTabFocused()
    }
  }

  onTabBlur = () => {
    if (this.game) {
      this.game.onTabBlurred()
    }
  }

  onClick = (e) => {
    if (this.game) {
      const { left, top } = this.canvasEl.getBoundingClientRect()
      const canvasClickX = e.clientX - left
      const canvasClickY = e.clientY - top
      this.game.onClick({ x: canvasClickX, y: canvasClickY })
    }
  }

  stop = () => {
    this.game = null
    window.removeEventListener('resize', this.onWindowResize)
    window.removeEventListener('keydown', this.onKeyDown)
    window.removeEventListener('focus', this.onTabFocus)
    window.removeEventListener('blur', this.onTabBlur)
    this.canvasEl.removeEventListener('mouseup', this.onClick)
  }
}

export default GameLoop
