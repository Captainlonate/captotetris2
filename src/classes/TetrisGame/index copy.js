import ImageLoader from '../ImageLoader'
import Block from '../Block'
import { ImageLabelsToPaths, BlockImageSize } from './images'

const BoardInfo = {
  NUMROWS: 15, // the top 2 are where the blocks spawn
  NUMCOLS: 7,
  STARTCOL: 3,
  STARTROW_BLOCK1: 0,
  STARTROW_BLOCK2: 1
}

class TetrisGame {
  constructor ({ ctx }) {
    this.ctx = ctx
    this.canvasWidth = 0
    this.canvasHeight = 0

    this.blockWidth = 0
    this.blockHeight = 0

    this.board = this.makeEmptyBoard()

    this.gameState = {
      gameIsRunning: false,
      pieceIsDropping: false,
      processingBoard: false,
      gameIsOver: false,
      userWon: false,
      imagesAreLoaded: false,
      userLost: false,
      acceptsUserInput: false
    }

    this.activeBlock1 = null
    this.activeBlock2 = null

    this.nextBlock1 = new Block()
    this.nextBlock2 = new Block()

    // Used in setInterval
    this.pieceDropInterval = null
    this.dropTheActivePiece = this.dropTheActivePiece.bind(this)

    this.imageManager = new ImageLoader({
      imagesToLoad: ImageLabelsToPaths,
      onDone: () => {
        this.allImagesAreLoaded()
      }
    })
  }

  allImagesAreLoaded () {
    this.gameState.gameIsRunning = true
    this.gameState.imagesAreLoaded = true
    this.spawnNewPiece()
  }

  update () {
    if (this.gameState.gameIsRunning) {
      //
    }
  }

  makeEmptyBoard () {
    const { NUMROWS, NUMCOLS } = BoardInfo
    return [...new Array(NUMROWS)].map(() => [...new Array(NUMCOLS)].fill(null))
  }

  draw () {
    if (this.gameState.gameIsRunning) {
      for (let rowIdx = 2; rowIdx < BoardInfo.NUMROWS; rowIdx++) {
        for (let colIdx = 0; colIdx < BoardInfo.NUMCOLS; colIdx++) {
          const blockToDraw = this.board[rowIdx][colIdx]
          if (blockToDraw) {
            this.ctx.drawImage(
              this.imageManager.getImage(blockToDraw.imageName),
              0, 0, BlockImageSize, BlockImageSize,
              colIdx * this.blockWidth, (rowIdx - 2) * this.blockHeight, this.blockWidth, this.blockHeight
            )
          }
        }
      }
    }
  }

  updateCanvasBounds (newCanvasWidth, newCanvasHeight) {
    this.canvasWidth = newCanvasWidth
    this.canvasHeight = newCanvasHeight
    this.recalculateBlockSize()
  }

  recalculateBlockSize () {
    this.blockWidth = Math.floor(this.canvasWidth / BoardInfo.NUMCOLS)
    this.blockHeight = Math.floor(this.canvasHeight / (BoardInfo.NUMROWS - 2))
  }

  spawnNewPiece () {
    // Make sure the spawn point is empty
    if (this.board[2][BoardInfo.STARTCOL] === null) {
      this.activeBlock1 = { block: this.nextBlock1, row: BoardInfo.STARTROW_BLOCK1, col: BoardInfo.STARTCOL }
      this.activeBlock2 = { block: this.nextBlock2, row: BoardInfo.STARTROW_BLOCK2, col: BoardInfo.STARTCOL }

      this.board[BoardInfo.STARTROW_BLOCK1][BoardInfo.STARTCOL] = this.activeBlock1.block
      this.board[BoardInfo.STARTROW_BLOCK2][BoardInfo.STARTCOL] = this.activeBlock2.block

      this.nextBlock1 = new Block()
      this.nextBlock2 = new Block()

      this.pieceDropInterval = setInterval(this.dropTheActivePiece, 1000)
      this.gameState.acceptsUserInput = true
    } else {
      console.log('The spawn point is not empty. Game is over?')
    }
  }

  isCellAvailable (row, col) {
    return (
      row >= 0 &&
      col >= 0 &&
      row < BoardInfo.NUMROWS &&
      col < BoardInfo.NUMCOLS &&
      this.board[row][col] === null
    )
  }

  blockCanDrop (row, col) {
    return (row + 1 < BoardInfo.NUMROWS) && this.board[row + 1][col] === null
  }

  blockCanLeft (row, col) {
    return (col - 1 >= 0) && this.board[row][col - 1] === null
  }

  blockCanRight (row, col) {
    return (col + 1 < BoardInfo.NUMCOLS) && this.board[row][col + 1] === null
  }

  dropBlockOne () {
    this.board[this.activeBlock1.row][this.activeBlock1.col] = null
    this.board[this.activeBlock1.row + 1][this.activeBlock1.col] = this.activeBlock1.block
    this.activeBlock1.row++
  }

  dropBlockTwo () {
    this.board[this.activeBlock2.row][this.activeBlock2.col] = null
    this.board[this.activeBlock2.row + 1][this.activeBlock2.col] = this.activeBlock2.block
    this.activeBlock2.row++
  }

  leftBlockOne () {
    this.board[this.activeBlock1.row][this.activeBlock1.col] = null
    this.board[this.activeBlock1.row][this.activeBlock1.col - 1] = this.activeBlock1.block
    this.activeBlock1.col--
  }

  leftBlockTwo () {
    this.board[this.activeBlock2.row][this.activeBlock2.col] = null
    this.board[this.activeBlock2.row][this.activeBlock2.col - 1] = this.activeBlock2.block
    this.activeBlock2.col--
  }

  rightBlockOne () {
    this.board[this.activeBlock1.row][this.activeBlock1.col] = null
    this.board[this.activeBlock1.row][this.activeBlock1.col + 1] = this.activeBlock1.block
    this.activeBlock1.col++
  }

  rightBlockTwo () {
    this.board[this.activeBlock2.row][this.activeBlock2.col] = null
    this.board[this.activeBlock2.row][this.activeBlock2.col + 1] = this.activeBlock2.block
    this.activeBlock2.col++
  }

  upBlockOne () {
    this.board[this.activeBlock1.row][this.activeBlock1.col] = null
    this.board[this.activeBlock1.row - 1][this.activeBlock1.col] = this.activeBlock1.block
    this.activeBlock1.row--
  }

  upBlockTwo () {
    this.board[this.activeBlock2.row][this.activeBlock2.col] = null
    this.board[this.activeBlock2.row - 1][this.activeBlock2.col] = this.activeBlock2.block
    this.activeBlock2.row--
  }

  swapActiveBlocks () {
    this.board[this.activeBlock1.row][this.activeBlock1.col] = this.activeBlock2.block
    this.board[this.activeBlock2.row][this.activeBlock2.col] = this.activeBlock1.block

    const { row: oldRow1, col: oldCol1 } = this.activeBlock1

    this.activeBlock1.row = this.activeBlock2.row
    this.activeBlock1.col = this.activeBlock2.col

    this.activeBlock2.row = oldRow1
    this.activeBlock2.col = oldCol1
  }

  dropTheActivePiece () {
    const { row: row1, col: col1 } = this.activeBlock1
    const { row: row2, col: col2 } = this.activeBlock2

    if (row1 === row2) { // If the blocks are side-by-side
      if (this.blockCanDrop(row1, col1) && this.blockCanDrop(row2, col2)) {
        this.dropBlockOne()
        this.dropBlockTwo()
      } else {
        this.endTheTurn()
      }
    } else if (row1 < row2) { // If block 2 is lower than block 1
      if (this.blockCanDrop(row2, col2)) {
        this.dropBlockTwo()
        this.dropBlockOne()
      } else {
        this.endTheTurn()
      }
    } else { // If block 1 is lower than block 2
      if (this.blockCanDrop(row1, col1)) {
        this.dropBlockOne()
        this.dropBlockTwo()
      } else {
        this.endTheTurn()
      }
    }
  }

  leftTheActivePiece () {
    const { row: row1, col: col1 } = this.activeBlock1
    const { row: row2, col: col2 } = this.activeBlock2

    if (col1 === col2) { // If the blocks are vertical
      if (this.blockCanLeft(row1, col1) && this.blockCanLeft(row2, col2)) {
        this.leftBlockOne()
        this.leftBlockTwo()
      }
    } else if (col1 < col2) { // If block 1 is left of block 2
      if (this.blockCanLeft(row1, col1)) {
        this.leftBlockOne()
        this.leftBlockTwo()
      }
    } else { // If block 2 is left of block 1
      if (this.blockCanLeft(row2, col2)) {
        this.leftBlockTwo()
        this.leftBlockOne()
      }
    }
  }

  rightTheActivePiece () {
    const { row: row1, col: col1 } = this.activeBlock1
    const { row: row2, col: col2 } = this.activeBlock2

    if (col1 === col2) { // If the blocks are vertical
      if (this.blockCanRight(row1, col1) && this.blockCanRight(row2, col2)) {
        this.rightBlockOne()
        this.rightBlockTwo()
      }
    } else if (col1 < col2) { // If block 2 is right of block 1
      if (this.blockCanRight(row2, col2)) {
        this.rightBlockTwo()
        this.rightBlockOne()
      }
    } else { // If block 1 is right of block 2
      if (this.blockCanRight(row1, col1)) {
        this.rightBlockOne()
        this.rightBlockTwo()
      }
    }
  }

  rotateTheActivePieceCW () {
    const { row: row1, col: col1 } = this.activeBlock1
    const { row: row2, col: col2 } = this.activeBlock2

    const b1IsLeft = col1 < col2
    const b1IsAbove = row1 < row2
    const blocksAreVertical = col1 === col2
    const blocksAreHoriz = row1 === row2

    if (b1IsAbove && blocksAreVertical) { // B1 is above B2
      if (this.isCellAvailable(row2, col2 + 1)) {
        // Can B1 move to the right of B2?
        this.rightBlockOne()
        this.dropBlockOne()
      } else if (this.isCellAvailable(row2, col2 - 1)) {
        // If not, can B2 move left and B1 move down?
        this.leftBlockTwo()
        this.dropBlockOne()
      } else {
        // Something to left and right, so just swap the blocks
        this.swapActiveBlocks()
      }
    } else if (!b1IsLeft && blocksAreHoriz) { // B1 is to the right of B2
      if (this.isCellAvailable(row2 + 1, col2)) {
        // Can B1 move below B2?
        this.dropBlockOne()
        this.leftBlockOne()
      } else if (this.isCellAvailable(row2 - 1, col2)) {
        // If not, can B2 move up and B1 move left
        this.upBlockTwo()
        this.leftBlockOne()
      } else {
        // Something above and below, so just swap the blocks
        this.swapActiveBlocks()
      }
    } else if (!b1IsAbove && blocksAreVertical) { // B1 is below B2
      if (this.isCellAvailable(row2, col2 - 1)) {
        // Can B1 move left of B2?
        this.leftBlockOne()
        this.upBlockOne()
      } else if (this.isCellAvailable(row2, col2 + 1)) {
        // If not, can B2 move right, and B1 move up?
        this.rightBlockTwo()
        this.upBlockOne()
      } else {
        // Something to left and right, so just swap the blocks
        this.swapActiveBlocks()
      }
    } else if (b1IsLeft && blocksAreHoriz) { // B1 is left of B2
      if (this.isCellAvailable(row2 - 1, col2)) {
        // Can B1 move above B2?
        this.upBlockOne()
        this.rightBlockOne()
      } else if (this.isCellAvailable(row2 + 1, col2)) {
        // If not, can B2 move down and B1 move right
        this.dropBlockTwo()
        this.rightBlockOne()
      } else {
        // Something above and below, so just swap the blocks
        this.swapActiveBlocks()
      }
    }
  }

  rotateTheActivePieceCCW () {
    const { row: row1, col: col1 } = this.activeBlock1
    const { row: row2, col: col2 } = this.activeBlock2

    const b1IsLeft = col1 < col2
    const b1IsAbove = row1 < row2
    const blocksAreVertical = col1 === col2
    const blocksAreHoriz = row1 === row2

    if (b1IsAbove && blocksAreVertical) { // B1 is above B2
      if (this.isCellAvailable(row2, col2 - 1)) {
        // Can B1 move left of B2?
        this.leftBlockOne()
        this.dropBlockOne()
      } else if (this.isCellAvailable(row2, col2 + 1)) {
        // If not, can B2 move right, and B1 move down?
        this.rightBlockTwo()
        this.dropBlockOne()
      } else {
        // Something to left and right, so just swap the blocks vertically
        this.swapActiveBlocks()
      }
    } else if (b1IsLeft && blocksAreHoriz) { // B1 is left of B2
      if (this.isCellAvailable(row2 + 1, col2)) {
        // Can B1 move below B2?
        this.dropBlockOne()
        this.rightBlockOne()
      } else if (this.isCellAvailable(row2 - 1, col2)) {
        // If not, can B2 move up and B1 move right
        this.upBlockTwo()
        this.rightBlockOne()
      } else {
        // Something above and below, so just swap the blocks horizontally
        this.swapActiveBlocks()
      }
    } else if (!b1IsAbove && blocksAreVertical) { // B1 is below B2
      if (this.isCellAvailable(row2, col2 + 1)) {
        // Can B1 move right of B2?
        this.rightBlockOne()
        this.upBlockOne()
      } else if (this.isCellAvailable(row2, col2 - 1)) {
        // If not, can B2 move left, and B1 move up
        this.leftBlockTwo()
        this.upBlockOne()
      } else {
        // Something left and right, so just swap the blocks vertically
        this.swapActiveBlocks()
      }
    } else if (!b1IsLeft && blocksAreHoriz) { // B1 is to the right of B2
      if (this.isCellAvailable(row2 - 1, col2)) {
        // Can B1 move above B2?
        this.upBlockOne()
        this.leftBlockOne()
      } else if (this.isCellAvailable(row2 + 1, col2)) {
        // If not, can B2 move down and B1 move left
        this.dropBlockTwo()
        this.leftBlockOne()
      } else {
        // Something above and below, so just swap the blocks horizontally
        this.swapActiveBlocks()
      }
    }
  }

  endTheTurn () {
    clearInterval(this.pieceDropInterval)
    this.pieceDropInterval = null
    this.gameState.acceptsUserInput = false
    this.spawnNewPiece()
  }

  onKeyPressed (keyCode) {
    if (this.gameState.acceptsUserInput && this.activeBlock1 && this.activeBlock2) {
      switch (keyCode) {
        case 87: // W
        case 38: // Up Arrow
          this.rotateTheActivePieceCW()
          break
        case 83: // S
        case 40: // D Arrow
          this.rotateTheActivePieceCCW()
          break
        case 65: // A
        case 37: // L Arrow
          this.leftTheActivePiece()
          break
        case 32: // SpaceBar
          this.dropTheActivePiece()
          break
        case 68: // D
        case 39: // R Arrow
          this.rightTheActivePiece()
          break
        default:
          break
      }
    }
  }
}

export default TetrisGame
