class GameLoop {
  constructor (canvasRef, boundingRef) {
    this.canvasEl = canvasRef.current
    this.gameArea = boundingRef.current
    this._ctx = this.canvasEl.getContext('2d')

    this.canvasWidth = this.canvasEl.width
    this.canvasHeight = this.canvasEl.height

    this.game = null

    this.start = this.start.bind(this)
    this.draw = this.draw.bind(this)
    this.update = this.update.bind(this)
    this.gameLoop = this.gameLoop.bind(this)
    this.setGame = this.setGame.bind(this)
    this.onWindowResize = this.onWindowResize.bind(this)
    this.onKeyDown = this.onKeyDown.bind(this)
    this.stop = this.stop.bind(this)

    this.onWindowResize()

    window.addEventListener('resize', this.onWindowResize)
    window.addEventListener('keydown', this.onKeyDown)
  }

  updateCanvasBounds () {
    this.canvasWidth = this.canvasEl.width
    this.canvasHeight = this.canvasEl.height
    this.game.updateCanvasBounds(this.canvasWidth, this.canvasHeight)
  }

  setGame (GameClass) {
    this.game = new GameClass({ ctx: this._ctx })
    this.game.updateCanvasBounds(this.canvasWidth, this.canvasHeight)
  }

  clearCanvas () {
    this._ctx.fillStyle = '#000000'
    this._ctx.fillRect(0, 0, this._ctx.canvas.width, this._ctx.canvas.height)
  }

  draw () {
    this.clearCanvas()
    this.game.draw()
  }

  update () {
    this.game.update()
  }

  start () {
    if (this.game) {
      this.gameLoop(0)
    } else {
      console.warn('No Game was set in the loop.')
    }
  }

  gameLoop () {
    if (this.game) {
      window.requestAnimationFrame(this.gameLoop)
      this.update()
      this.draw()
    }
  }

  onWindowResize () {
    const { width: gameAreaWidth, height: gameAreaHeight } = this.gameArea.getBoundingClientRect()

    const maxBlockHeight = Math.floor(gameAreaHeight / 13)
    const maxBlockWidth = maxBlockHeight

    const newCanvasHeight = maxBlockHeight * 13
    const newCanvasWidth = maxBlockWidth * 7

    this.canvasWidth = newCanvasWidth
    this.canvasHeight = newCanvasHeight

    this.canvasEl.width = newCanvasWidth * window.devicePixelRatio
    this.canvasEl.height = newCanvasHeight * window.devicePixelRatio

    this.canvasEl.style.width = newCanvasWidth + 'px'
    this.canvasEl.style.height = newCanvasHeight + 'px'

    this._ctx.scale(window.devicePixelRatio, window.devicePixelRatio)

    if (this.game) {
      this.game.updateCanvasBounds(newCanvasWidth, newCanvasHeight)
    }
  }

  onKeyDown (e) {
    if (this.game) {
      this.game.onKeyPressed(e.keyCode)
    }
  }

  stop () {
    this.game = null
    window.removeEventListener('resize', this.onWindowResize)
    window.removeEventListener('keydown', this.onKeyDown)
  }
}

export default GameLoop
