import { Socket } from 'socket.io-client'

import ImageLoader from '../ImageLoader'
import Block from '../Block'
import { ShadowBlockColors } from '../Block/blockColors'
import { ImageLabelsToPaths, BlockImageSize } from './images'
import BoardManager from '../BoardManager'
import { chanceToGetBreaker } from '../Block/blockTypes'
import { removeDuplicateTuples } from '../../utils/tuples'
import SoundManager from '../SoundManager'
import sounds from '../SoundManager/sounds'
import PauseButton from '../PauseButton'
import GameStateManager from '../GameStateManager'
import InputManager from '../InputManager'
import BorderManager from '../BorderManager'
import ShatterAnimation from '../ShatterAnimation'
import Timer, { SECONDS } from './Timer'
import { BLOCKCOLORHEX } from '../Block/blockColors'
import GameProgress from '../GameProgress'

class TetrisGame {
  static NUMROWS = 15
  static NUMCOLS = 7

  constructor({ ctx, twoPlayerMatchID = null, socket = null }) {
    this.ctx = ctx
    // Initialized and holds all dimensions & positions
    this.dim = this.getInitialPositionsAndSizes()
    // Holds game state (what action is currently happening)
    this.state = new GameStateManager()
    // The next 2 blocks to spawn (previews are shown in left sidebar)
    this.nextBlock1 = this.makeRegularBlock()
    this.nextBlock2 = this.makeRegularBlock()
    // Timers used with requestAnimationFrame
    this.time = this.getInitialTimers()
    // UI Buttons (that animate)
    this.pauseButton = new PauseButton()
    // Holds cells that are marked for shattering animation and removal
    this.cellsToBreakLater = null
    this.shatterAnimations = []
    // One Player vs Two Player
    // Double check that socket is truly an instance of SocketIO
    const isValidSocket = socket && socket instanceof Socket
    const isValidMatchID =
      typeof twoPlayerMatchID === 'string' && twoPlayerMatchID.trim().length > 2
    const isTwoPlayer = isValidSocket && isValidMatchID
    this.socket = isTwoPlayer ? socket : null
    this.matchID = isTwoPlayer ? twoPlayerMatchID : null
    this.opponentBoard = {
      str: null,
      blocks: null,
    }

    // Contains the board, allows access and mechanical functions
    this.boardManager = new BoardManager({
      numRows: TetrisGame.NUMROWS,
      numCols: TetrisGame.NUMCOLS,
      onEndTurn: this.onEndTurn,
      onCannotSpawn: this.onCannotSpawn,
      onDoneDroppingBlocks: this.onDoneDroppingBlocks,
    })
    // Handles drawing borders around cells
    this.borders = new BorderManager({
      numRows: TetrisGame.NUMROWS,
      numCols: TetrisGame.NUMCOLS,
    })
    // Keyboard inputs are passed to inputManager to fire translated events ('up', 'down', etc)
    this.inputManager = new InputManager()
    this.registerInputHandlers()
    //
    this.progress = new GameProgress()
    // Facilitates sound and image loading
    this.soundManager = new SoundManager(sounds)
    this.imageManager = new ImageLoader({
      imagesToLoad: ImageLabelsToPaths,
      onDone: () => this.allImagesAreLoaded(),
    })
  }

  getInitialTimers() {
    return {
      pieceDrop: new Timer({ duration: 1 * SECONDS }), // speed for active piece to fall
      blockFall: new Timer({ duration: 0.05 * SECONDS }), // speed for blocks to fall
      blockAnim: new Timer({ duration: Math.floor((3 * SECONDS) / 30) }), // block idle animation speed
      blockRareAnim: new Timer({ duration: 5 * SECONDS }), // block rare animation speed
      pauseBtnAnim: new Timer({ duration: Math.floor((2 * SECONDS) / 30) }), // pause button animation speed
      drawBorders: new Timer({ duration: 1.5 * SECONDS }), // how long to draw borders for pieces that will then break
      shatterAnim: new Timer({ duration: Math.floor((0.5 * SECONDS) / 30) }), // blocks shattering animation speed
      shattering: new Timer({ duration: 0.5 * SECONDS }), // total duration it takes to shatter a block

      //
      sendBoard: new Timer({ duration: 20 * SECONDS }), // How often to socket emit the board
    }
  }

  getInitialPositionsAndSizes() {
    return {
      canvasWidth: 0,
      canvasHeight: 0,
      leftSidebarWidth: 0,
      boardWidth: 0,
      blockWidth: 0,
      blockHeight: 0,
      blockSrcDimensions: [0, 0],
      sidebarBlockOffsetX: 0,
      sidebarBlockOffsetY: 0,
      sidebarBlockGapY: 0,
      sidebarNextOffsetY: 0,
      blockTargetSize: [0, 0],
      sidebarBlockOneDims: [0, 0, 0, 0],
      sidebarBlockTwoDims: [0, 0, 0, 0],
      pauseButtonDims: [0, 0, 0, 0],
      shatterAnimationSize: 0,
      shatterAnimationOffset: 0,
      //
      sidebarPreviewBlock: 0,
      sidebarPreviewDims: [0, 0, 0, 0],
      opponentTextOffset: [0, 0],
    }
  }

  // Registers the functions that should run when keyboard events have fired
  registerInputHandlers() {
    this.inputManager.on('up', () =>
      this.boardManager.rotateTheActivePieceCCW()
    )
    this.inputManager.on('right', () => this.boardManager.rightTheActivePiece())
    this.inputManager.on('down', () =>
      this.boardManager.rotateTheActivePieceCW()
    )
    this.inputManager.on('left', () => this.boardManager.leftTheActivePiece())
    this.inputManager.on('space', () => this.boardManager.dropTheActivePiece())
  }

  // When the active piece has completely fallen
  onEndTurn = () => {
    this.soundManager.play('tink')
    this.state.setProcessingBoard()
  }

  // When the boardManager is not able to spawn a new active piece
  onCannotSpawn = () => {
    this.state.setProcessingBoard()
  }

  // When the boardManager has finished dropping all blocks that can drop
  onDoneDroppingBlocks = () => {
    this.state.setProcessingBoard()
  }

  // When all image assets have been loaded into memory
  allImagesAreLoaded() {
    // TODO: Game can start, establish network connection
    this.startTheGame()
  }

  // When the game is done initializing, and the user may begin playing
  startTheGame() {
    this.state.hasStarted = true
    // this.boardManager.spawnNewActivePiece(this.makeRegularBlock(), this.makeRegularBlock())
    // TODO: Delete
    this.boardManager.spawnNewActivePiece(
      new Block({ blockType: 'BREAKER', color: 'GREEN' }),
      this.makeRegularBlock()
    )
    this.state.setControllingPiece()
    if (!document.hasFocus()) {
      console.log('The game begins paused, document does not have focus.')
      this.pauseTheGame()
    }
    // TODO: Remove
    const fakeOpponentBoardStr = this.boardManager.generateBoardShadow()
    console.log('fakeOpponentBoardStr', fakeOpponentBoardStr)
    this.setOpponentsBoard(fakeOpponentBoardStr)
  }

  // Called by requestAnimationFrame() to progress the game logic and animations
  update(deltaTime) {
    if (this.state.hasStarted) {
      if (!this.state.gameIsPaused) {
        this.updateGameLogic(deltaTime)
        this.updateBlockAnimations(deltaTime)
        this.updateSocketSendBoard(deltaTime)
      }
      this.updatePausePlayButtonAnimation(deltaTime)
    }
  }

  // Called with each requestAnimationFrame()
  // Uses the current state of the game to know what to do next
  updateGameLogic(deltaTime) {
    if (this.state.needToProcessTheBoard) {
      this.processTheBoardGetNewState()
    } else if (this.state.pieceIsDropping) {
      if (this.time.pieceDrop.updateAndCheck(deltaTime)) {
        this.boardManager.dropTheActivePiece()
      }
    } else if (this.state.droppingBlocks) {
      if (this.time.blockFall.updateAndCheck(deltaTime)) {
        this.boardManager.dropBlocksWithSpacesBeneath()
      }
    } else if (this.state.borderingBlocks) {
      if (this.time.drawBorders.updateAndCheck(deltaTime)) {
        this.stopBorderingsStartShattering()
      }
    } else if (this.state.shatteringBlocks) {
      const doneShattering = this.time.shattering.updateAndCheck(deltaTime)
      const doneWithShatterFrame =
        this.time.shatterAnim.updateAndCheck(deltaTime)
      if (doneShattering) {
        this.time.shatterAnim.reset()
        this.stopShattering()
      } else if (doneWithShatterFrame) {
        for (const shatter of this.shatterAnimations) {
          shatter.updateFrame()
        }
      }
    }
  }

  // The simple block animations for each block
  updateBlockAnimations(deltaTime) {
    if (this.time.blockAnim.updateAndCheck(deltaTime)) {
      this.boardManager.updateBlockAnimations()
    }
    if (this.time.blockRareAnim.updateAndCheck(deltaTime)) {
      this.boardManager.tryToPlayRareAnimation()
    }
  }

  // The simple animation for the Pause/Play button
  updatePausePlayButtonAnimation(deltaTime) {
    if (this.time.pauseBtnAnim.updateAndCheck(deltaTime)) {
      this.pauseButton.updateFrame()
    }
  }

  // Check if the player needs to send their board to the server
  updateSocketSendBoard(deltaTime) {
    if (this.socket && !this.state.gameIsOver) {
      if (this.time.sendBoard.updateAndCheck(deltaTime)) {
        this.socketEmitGameBoard()
      }
    }
  }

  // Called with each requestAnimationFrame()
  // Responsible for drawing everything that the user sees
  draw() {
    if (this.state.hasStarted) {
      this.drawLeftSidebar()
      this.drawBoard()
      if (this.state.gameIsPaused) {
        this.drawPaused()
      }
    }
  }

  drawLeftSidebar() {
    const {
      leftSidebarWidth,
      canvasHeight,
      sidebarNextOffsetY,
      blockSrcDimensions,
      sidebarBlockOneDims,
      sidebarBlockTwoDims,
      blockWidth,
      pauseButtonDims,
    } = this.dim

    // The dark background
    this.ctx.globalAlpha = 0.3
    this.ctx.fillStyle = '#000000'
    this.ctx.fillRect(0, 0, leftSidebarWidth, canvasHeight)
    this.ctx.globalAlpha = 1.0
    // The "Next" text
    this.ctx.font = `${blockWidth * 0.45}px TradeWinds`
    this.ctx.fillStyle = 'white'
    this.ctx.textAlign = 'center'
    this.ctx.fillText('Next', leftSidebarWidth / 2, sidebarNextOffsetY)
    // The two preview blocks
    if (this.nextBlock1 && this.nextBlock2) {
      this.ctx.drawImage(
        this.imageManager.getImage(this.nextBlock1.imageName),
        ...this.nextBlock1.getImageSrcXandY(),
        ...blockSrcDimensions,
        ...sidebarBlockOneDims
      )
      this.ctx.drawImage(
        this.imageManager.getImage(this.nextBlock2.imageName),
        ...this.nextBlock2.getImageSrcXandY(),
        ...blockSrcDimensions,
        ...sidebarBlockTwoDims
      )
    }
    // Draw the pause button
    this.ctx.drawImage(
      this.imageManager.getImage(this.pauseButton.imageName),
      ...this.pauseButton.getImageSrcXandY(),
      ...blockSrcDimensions,
      ...pauseButtonDims
    )
    // Draw the Opponent's shadow board preview
    this.drawOpponentBoard()
  }

  // Draws the blocks on the board (in their animated state, idle, rare, shattering)
  // Draws any borders around those blocks
  drawBoard() {
    let x = 0
    let y = 0
    const {
      leftSidebarWidth,
      blockWidth,
      blockHeight,
      blockSrcDimensions,
      blockTargetSize,
      shatterAnimationOffset,
      shatterAnimationSize,
    } = this.dim

    for (let rowIdx = 2; rowIdx < TetrisGame.NUMROWS; rowIdx++) {
      for (let colIdx = 0; colIdx < TetrisGame.NUMCOLS; colIdx++) {
        const blockToDraw = this.boardManager.getCell(rowIdx, colIdx)
        if (blockToDraw) {
          x = leftSidebarWidth + colIdx * blockWidth
          y = (rowIdx - 2) * blockHeight
          this.ctx.drawImage(
            this.imageManager.getImage(blockToDraw.imageName),
            ...blockToDraw.getImageSrcXandY(),
            ...blockSrcDimensions,
            x,
            y,
            ...blockTargetSize
          )
        }
      }
    }

    // Draw Cell Borders
    if (this.borders.doesAnythingNeedBordered) {
      this.ctx.lineWidth = 4
      this.ctx.beginPath()
      for (const cellToBorder of this.borders.cellsToBeBordered) {
        this.drawBorder(cellToBorder)
      }
      this.ctx.stroke()
    }

    // The shattering animations are larger than the block's size
    if (this.state.shatteringBlocks) {
      this.ctx.globalAlpha = 1 - this.time.shattering.percentDone()
      for (const shatter of this.shatterAnimations) {
        this.ctx.drawImage(
          this.imageManager.getImage(shatter.imageName),
          ...shatter.getImageSrcXandY(),
          ...blockSrcDimensions,
          leftSidebarWidth - shatterAnimationOffset + shatter.col * blockWidth,
          (shatter.row - 2) * blockWidth - shatterAnimationOffset,
          shatterAnimationSize,
          shatterAnimationSize
        )
      }
      this.ctx.globalAlpha = 1
    }
  }

  // Draw borders around a single cell
  drawBorder({ row, col, sides, color }) {
    this.ctx.strokeStyle = BLOCKCOLORHEX[color]
    for (const side of sides) {
      // Because 2 rows are not drawn on the canvas, 2 must be subtracted
      // from the real row of the blocks, when calculating the y coordinates
      const [x, y, endX, endY] = this.borders.getCoords(row - 2, col, side)
      this.ctx.moveTo(x, y)
      this.ctx.lineTo(endX, endY)
    }
  }

  // When the game is paused, some text appears within the board
  drawPaused() {
    const { blockWidth, leftSidebarWidth, canvasHeight, boardWidth } = this.dim

    this.ctx.font = `${blockWidth * 0.7}px TradeWinds`
    this.ctx.fillStyle = 'red'
    this.ctx.textAlign = 'center'
    this.ctx.fillText(
      'Paused',
      leftSidebarWidth + boardWidth / 2,
      canvasHeight / 2
    )
  }

  //
  drawOpponentBoard() {
    if (
      Array.isArray(this.opponentBoard?.blocks) &&
      Array.isArray(this.opponentBoard?.blocks[0])
    ) {
      const {
        blockWidth,
        sidebarPreviewDims: [offsetX, offsetY, fullWidth, fullHeight],
        opponentTextOffset: [textX, textY],
      } = this.dim
      // let [offsetX, offsetY, fullWidth, fullHeight] = this.dim.sidebarPreviewDims
      // Draw the preview board's background
      this.ctx.globalAlpha = 0.5
      this.ctx.fillStyle = '#000000'
      this.ctx.fillRect(offsetX, offsetY, fullWidth, fullHeight)
      // The "Opponent" text
      this.ctx.font = `${blockWidth * 0.25}px TradeWinds`
      this.ctx.fillStyle = 'white'
      this.ctx.textAlign = 'left'
      this.ctx.fillText('Opponent', textX, textY)
      // Draw the cells
      this.ctx.globalAlpha = 1
      if (this.opponentBoard?.blocks) {
        this.opponentBoard?.blocks?.forEach(([color, blockSDims]) => {
          // Only set the color once, per color
          this.ctx.fillStyle = color
          // Batch fill all the rects of this color
          this.ctx.beginPath()
          // Then draw all of the blocks of that color
          blockSDims.forEach((blockDim) => {
            this.ctx.rect(...blockDim)
          })
          this.ctx.fill()
        })
      }
    }
  }

  // Called when the window resizes
  updateCanvasBounds(
    newCanvasWidth,
    newCanvasHeight,
    leftSidebarWidth,
    boardWidth
  ) {
    this.dim.canvasWidth = newCanvasWidth
    this.dim.canvasHeight = newCanvasHeight
    this.dim.leftSidebarWidth = leftSidebarWidth
    this.dim.boardWidth = boardWidth
    this.recalculateBlockSize()
    this.recalculateSidebar()
    this.borders.recalculateAllCellCoordinates({
      blockSize: this.dim.blockWidth,
      xOffset: leftSidebarWidth,
    })
  }

  recalculateBlockSize() {
    this.dim.blockWidth = Math.floor(this.dim.boardWidth / TetrisGame.NUMCOLS)
    this.dim.blockHeight = Math.floor(
      this.dim.canvasHeight / (TetrisGame.NUMROWS - 2)
    )
    this.dim.blockSrcDimensions = [BlockImageSize, BlockImageSize]
    this.dim.blockTargetSize = [this.dim.blockWidth, this.dim.blockHeight]
    this.dim.shatterAnimationSize = this.dim.blockWidth * 2
    this.dim.shatterAnimationOffset = this.dim.blockWidth / 2
  }

  recalculateSidebar() {
    // "Next" text
    this.dim.sidebarNextOffsetY = Math.floor(this.dim.blockHeight)
    // Preview Blocks - Offsets
    this.dim.sidebarBlockOffsetX = Math.floor(this.dim.leftSidebarWidth * 0.25)
    this.dim.sidebarBlockOffsetY = Math.floor(this.dim.blockHeight * 1.5)
    this.dim.sidebarBlockGapY = Math.floor(this.dim.blockHeight / 4)
    // Preview blocks - location and sizes
    this.dim.sidebarBlockOneDims = [
      this.dim.sidebarBlockOffsetX,
      this.dim.sidebarBlockOffsetY,
      this.dim.blockWidth,
      this.dim.blockHeight,
    ]
    const sidebarBlockTwoY =
      this.dim.sidebarBlockOffsetY +
      this.dim.blockHeight +
      this.dim.sidebarBlockGapY
    this.dim.sidebarBlockTwoDims = [
      this.dim.sidebarBlockOffsetX,
      sidebarBlockTwoY,
      this.dim.blockWidth,
      this.dim.blockHeight,
    ]
    // Where the pause button should be drawn
    this.dim.pauseButtonDims = [
      this.dim.sidebarBlockOffsetX,
      this.dim.canvasHeight - 2 * this.dim.blockHeight,
      this.dim.blockWidth,
      this.dim.blockHeight,
    ]
    // Where the board preview should be drawn
    this.dim.sidebarPreviewBlock = Math.floor(
      (this.dim.leftSidebarWidth * 0.8) / TetrisGame.NUMCOLS
    )
    this.dim.sidebarPreviewDims = [
      Math.floor(this.dim.leftSidebarWidth * 0.15),
      Math.floor(this.dim.canvasHeight * 0.38),
      this.dim.sidebarPreviewBlock * TetrisGame.NUMCOLS,
      this.dim.sidebarPreviewBlock * TetrisGame.NUMROWS,
    ]
    this.dim.opponentTextOffset = [
      this.dim.sidebarPreviewDims[0] + this.dim.blockWidth * 0.15,
      this.dim.sidebarPreviewDims[1] - this.dim.blockWidth * 0.15,
    ]
    this.preCalculateOpponentBoard()
  }

  handleGameIsOver(isWin) {
    this.state.setGameIsOver()
    const msg = isWin ? 'You won!' : 'You lost!'
    console.info(msg)
  }

  // The primary Game Logic function. Called in between states. Responsible
  // for figuring out the game's next state when one completes
  processTheBoardGetNewState() {
    const blocksThatCanDrop = this.checkBoardForBlocksThatCanDrop()
    const thereAreBlocksToDrop = blocksThatCanDrop.length > 0

    const blocksToBreak = thereAreBlocksToDrop
      ? []
      : this.boardManager.getPossibleBreaks()
    const thereAreBlocksToBreak = blocksToBreak.length > 0

    if (thereAreBlocksToDrop) {
      this.boardManager.setBlocksThatNeedToFall(blocksThatCanDrop)
      this.state.setDroppingBlocks()
    } else if (thereAreBlocksToBreak) {
      this.cellsToBreakLater = blocksToBreak
      console.log('blocksToBreak', blocksToBreak)
      this.borders.setCellsToBeBordered(blocksToBreak)
      this.state.setBorderingBlocks()
    } else if (!this.boardManager.canSpawnNewPiece()) {
      this.handleGameIsOver()
    } else {
      this.boardManager.setBlocksThatNeedToFall([])
      this.boardManager.spawnNewActivePiece(this.nextBlock1, this.nextBlock2)
      this.nextBlock1 = this.makeRegularBlock()
      this.nextBlock2 = this.makeRegularBlock()
      this.state.setControllingPiece()
    }
  }

  /*
    Checks every cell of the board and records if it can be dropped. It can be
    dropped if there is an empty cell beneath it, or, if the cell beneath it
    can also be dropped.
    @return an array of tuples. Each one describes a cell that can be dropped
      ex: [[rowIdx, colIdx], [rowIdx, colIdx], ...]
  */
  checkBoardForBlocksThatCanDrop() {
    let thisCellIsEmpty = null
    let cellAboveThisCellIsNotEmpty = null
    const blocksThatCanDrop = []

    for (let rowIdx = TetrisGame.NUMROWS - 1; rowIdx >= 2; rowIdx--) {
      for (let colIdx = 0; colIdx < TetrisGame.NUMCOLS; colIdx++) {
        thisCellIsEmpty = this.boardManager.isCellAvailable(rowIdx, colIdx)
        cellAboveThisCellIsNotEmpty = !this.boardManager.isCellAvailable(
          rowIdx - 1,
          colIdx
        )
        if (thisCellIsEmpty && cellAboveThisCellIsNotEmpty) {
          // The above cell can be dropped
          blocksThatCanDrop.push([rowIdx - 1, colIdx])
          // If there are also cells above this that are occupied, then
          // those can drop too (even though the cell below isn't empty)
          let chainedRowIdx = rowIdx - 2 // Already checked rowIdx - 1
          while (
            chainedRowIdx >= 2 &&
            !this.boardManager.isCellAvailable(chainedRowIdx, colIdx)
          ) {
            blocksThatCanDrop.push([chainedRowIdx, colIdx])
            chainedRowIdx--
          }
        }
      }
    }

    return removeDuplicateTuples(blocksThatCanDrop)
  }

  /*
    This will produce a block whose type has a small chance to
    be a "Breaker", but is otherwise just a "Normal" block
  */
  makeRegularBlock() {
    return new Block({ blockType: chanceToGetBreaker() })
  }

  // Once the cell borders have been drawn for a while, next it
  // will be time to start the cells' shattering animations
  stopBorderingsStartShattering() {
    this.progress.addBreak(this.cellsToBreakLater.map((cell) => cell.cells))
    this.boardManager.breakBlocks(this.cellsToBreakLater)
    this.soundManager.play('success')
    this.borders.clearCellsToBeBordered()
    this.setupCellsToShatter()
    this.state.setShatteringBlocks()
  }

  // Once the cells' shattering animations have played through,
  // then it's time to actually remove the blocks from the board
  // and consider the game's next state
  stopShattering() {
    this.cellsToBreakLater = null
    this.shatterAnimations = []
    this.state.setProcessingBoard()
  }

  // All keyboard input will be handled by the 'InputManager', and converted
  // into events ('up', 'down', etc)
  onKeyPressed(keyCode) {
    if (this.state.acceptsUserInput && this.boardManager.hasActivePiece()) {
      this.inputManager.handleKeyUp(keyCode)
    }
  }

  // All clicks on the canvas will be first routed here
  onClick({ x, y }) {
    if (this.checkIfPauseButtonClicked(x, y)) {
      this.handlePauseButtonClicked()
    }
  }

  onTabFocused() {}

  // When the user clicks away from this browser tab, the game will pause
  onTabBlurred() {
    this.pauseTheGame()
  }

  unpauseTheGame() {
    console.log('Unpausing')
    this.state.restoreStashedState()
    this.pauseButton.doPlayingAnimation()
  }

  pauseTheGame() {
    console.log('Pausing')
    if (!this.state.gameIsPaused) {
      this.state.stashCurrentState()
      this.state.setPauseGame()
      this.pauseButton.doPausedAnimation()
    }
  }

  handlePauseButtonClicked() {
    if (this.state.gameIsPaused) {
      this.unpauseTheGame()
    } else {
      this.pauseTheGame()
    }
  }

  checkIfPauseButtonClicked(clickX, clickY) {
    const [btnX, btnY, btnWidth, btnHeight] = this.dim.pauseButtonDims
    return (
      clickX >= btnX &&
      clickY >= btnY &&
      clickX <= btnX + btnWidth &&
      clickY <= btnY + btnHeight
    )
  }

  setupCellsToShatter() {
    this.shatterAnimations = this.cellsToBreakLater
      .map(({ color, cells }) =>
        cells.map(([row, col]) => ({ row, col, color }))
      )
      .flat()
      .map((shatterConfig) => new ShatterAnimation(shatterConfig))
  }

  //
  socketEmitTrash = (payload) => {
    if (this.socket) {
      this.socket.emit('MATCH_SEND_BREAKS', {
        matchID: this.matchID,
        breaks: [],
      })
    }
  }

  //
  socketEmitGameBoard = () => {
    if (this.socket && !this.state.gameIsOver) {
      const boardShadowStr = this.boardManager.generateBoardShadow()
      console.log('Emitting game board', boardShadowStr)

      // TODO: Fake take this out
      this.setOpponentsBoard(boardShadowStr)

      // this.socket.emit('MATCH_SEND_BOARD', {
      //   matchID: this.matchID,
      //   board: boardShadowStr,
      // })
    }
  }

  //
  queueTrash = (payload) => {
    console.log('Tetris queuing trash...', payload)
  }

  //
  setOpponentsBoard = (boardString) => {
    // Number of cells in the board (not counting commas or separators)
    const numberOfCells = TetrisGame.NUMCOLS * TetrisGame.NUMROWS
    if (
      typeof boardString === 'string' &&
      boardString.trim().length >= numberOfCells
    ) {
      // this.opponentBoard.str = boardString
      //   .split(',')
      //   .map((row) => row.split(''))
      this.preCalculateOpponentBoard(boardString)
    }
  }

  preCalculateOpponentBoard = (boardStr) => {
    const boardString = boardStr ?? this?.opponentBoard?.str
    console.log('preCalculateOpponentBoard', {
      boardStr,
      'opponentBoard.str': this?.opponentBoard?.str,
      'typeof boardStr': typeof boardStr,
      'typeof boardString': typeof boardString,
      'will return': typeof boardString !== 'string',
    })
    if (typeof boardString !== 'string') {
      return
    }

    const boardArray = boardString.split(',').map((row) => row.split(''))

    //
    const groups = {}
    const {
      sidebarPreviewDims: [offsetX, offsetY],
      sidebarPreviewBlock,
    } = this.dim

    for (let rowIdx = 0; rowIdx < boardArray.length; rowIdx++) {
      let row = boardArray[rowIdx]
      for (let colIdx = 0; colIdx < row.length; colIdx++) {
        let cellCode = row[colIdx]
        if (cellCode !== '0') {
          let color = ShadowBlockColors.codeToColor[cellCode]
          groups[color] = groups[color] ?? []
          groups[color].push([
            offsetX + sidebarPreviewBlock * colIdx, // x
            offsetY + sidebarPreviewBlock * rowIdx, // y
            sidebarPreviewBlock, // width
            sidebarPreviewBlock, // height
          ])
        }
      }
    }

    console.log('setting this.opponentBoard', {
      str: boardStr,
      blocks: Object.entries(groups),
    })

    this.opponentBoard = {
      str: boardStr,
      blocks: Object.entries(groups),
    }
  }
}

export default TetrisGame
