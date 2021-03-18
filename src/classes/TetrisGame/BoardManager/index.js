import { sortTuplesDesc } from '../../../utils/tuples'
import Block from '../../Block'

class BoardManager {
  constructor ({ numRows, numCols, onEndTurn, onCannotSpawn, onDoneDroppingBlocks }) {
    this.numRows = numRows
    this.numCols = numCols
    this.blockStartCol = 3
    this.startRowBlockOne = 0
    this.startRowBlockTwo = 1

    // 2d array of cells. Each cell is either null or a Block()
    this.board = this.resetBoard(this.numRows, this.numCols)

    this.activeBlock1 = null
    this.activeBlock2 = null

    this.blocksThatNeedToFall = []

    this.onEndTurn = () => onEndTurn()
    this.onCannotSpawn = () => onCannotSpawn()
    this.onDoneDroppingBlocks = () => onDoneDroppingBlocks()
  }

  spawnNewActivePiece (blockOne, blockTwo) {
    if (this.canSpawnNewPiece()) {
      this.activeBlock1 = { block: blockOne, row: this.startRowBlockOne, col: this.blockStartCol }
      this.activeBlock2 = { block: blockTwo, row: this.startRowBlockTwo, col: this.blockStartCol }

      this.board[this.startRowBlockOne][this.blockStartCol] = this.activeBlock1.block
      this.board[this.startRowBlockTwo][this.blockStartCol] = this.activeBlock2.block
    } else {
      console.log('The board is full. Game over?')
      this.onCannotSpawn()
    }
  }

  // resetBoard (numRows, numCols) {
  //   return [...new Array(numRows)].map(() => [...new Array(numCols)].fill(null))
  // }

  resetBoard (numRows, numCols) {
    let tempBoard = [...new Array(numRows)].map(() => [...new Array(numCols)].fill(null))
    tempBoard = [
      [null, null, null, null, null, null, null], // 0
      [null, null, null, null, null, null, null], // 1
      [null, null, null, null, null, null, null], // 2
      [null, null, null, null, null, null, new Block({ color: 'RED' })], // 3
      [null, null, null, null, null, null, new Block({ color: 'RED' })], // 4
      [null, null, null, null, null, null, new Block({ color: 'RED' })], // 5
      [null, null, null, null, null, null, new Block({ color: 'RED' })], // 6
      [new Block({ color: 'YELLOW' }), null, null, null, null, null, new Block({ color: 'RED' })], // 7
      [new Block({ color: 'RED' }), null, null, null, null, null, new Block({ color: 'GREEN' })], // 8
      [new Block({ color: 'GREEN' }), null, null, null, null, null, new Block({ color: 'GREEN' })], // 9
      [new Block({ color: 'BLUE' }), null, null, null, null, null, new Block({ color: 'GREEN' })], // 10
      [new Block({ blockType: 'BREAKER', color: 'YELLOW' }), null, null, null, null, null, new Block({ color: 'GREEN' })], // 11
      [new Block({ blockType: 'BREAKER', color: 'RED' }), null, null, null, null, null, new Block({ color: 'GREEN' })], // 12
      [new Block({ blockType: 'BREAKER', color: 'GREEN' }), null, null, null, null, null, new Block({ color: 'GREEN' })], // 13
      [new Block({ blockType: 'BREAKER', color: 'BLUE' }), null, null, null, null, null, new Block({ color: 'GREEN' })] // 14
    ]
    return tempBoard
  }

  getCell (row, col) {
    return this.board[row][col]
  }

  isWithinBounds (row, col) {
    return (
      row >= 0 &&
      col >= 0 &&
      row < this.numRows &&
      col < this.numCols
    )
  }

  isCellAvailable (row, col) {
    return (
      this.isWithinBounds(row, col) &&
      this.board[row][col] === null
    )
  }

  moveActiveBlock (activeBlock, toRow, toCol) {
    const { row: oldRow, col: oldCol, block } = activeBlock

    this.board[toRow][toCol] = block
    this.board[oldRow][oldCol] = null

    activeBlock.row = toRow
    activeBlock.col = toCol
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
        this.moveActiveBlock(this.activeBlock1, row1 + 1, col1 + 1)
      } else if (this.isCellAvailable(row2, col2 - 1)) {
        // If not, can B2 move left and B1 move down?
        this.moveABLeft(this.activeBlock2)
        this.moveABDown(this.activeBlock1)
      } else {
        this.swapActiveBlocks()
      }
    } else if (!b1IsLeft && blocksAreHoriz) { // B1 is to the right of B2
      if (this.isCellAvailable(row2 + 1, col2)) {
        // Can B1 move below B2?
        this.moveActiveBlock(this.activeBlock1, row1 + 1, col1 - 1)
      } else if (this.isCellAvailable(row2 - 1, col2)) {
        // If not, can B2 move up and B1 move left
        this.moveABUp(this.activeBlock2)
        this.moveABLeft(this.activeBlock1)
      } else {
        this.swapActiveBlocks()
      }
    } else if (!b1IsAbove && blocksAreVertical) { // B1 is below B2
      if (this.isCellAvailable(row2, col2 - 1)) {
        // Can B1 move left of B2?
        this.moveActiveBlock(this.activeBlock1, row1 - 1, col1 - 1)
      } else if (this.isCellAvailable(row2, col2 + 1)) {
        // If not, can B2 move right, and B1 move up?
        this.moveABRight(this.activeBlock2)
        this.moveABUp(this.activeBlock1)
      } else {
        this.swapActiveBlocks()
      }
    } else if (b1IsLeft && blocksAreHoriz) { // B1 is left of B2
      if (this.isCellAvailable(row2 - 1, col2)) {
        // Can B1 move above B2?
        this.moveActiveBlock(this.activeBlock1, row1 - 1, col1 + 1)
      } else if (this.isCellAvailable(row2 + 1, col2)) {
        // If not, can B2 move down and B1 move right
        this.moveABDown(this.activeBlock2)
        this.moveABRight(this.activeBlock1)
      } else {
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
        this.moveActiveBlock(this.activeBlock1, row1 + 1, col1 - 1)
      } else if (this.isCellAvailable(row2, col2 + 1)) {
        // If not, can B2 move right, and B1 move down?
        this.moveABRight(this.activeBlock2)
        this.moveABDown(this.activeBlock1)
      } else {
        this.swapActiveBlocks()
      }
    } else if (b1IsLeft && blocksAreHoriz) { // B1 is left of B2
      if (this.isCellAvailable(row2 + 1, col2)) {
        // Can B1 move below B2?
        this.moveActiveBlock(this.activeBlock1, row1 + 1, col1 + 1)
      } else if (this.isCellAvailable(row2 - 1, col2)) {
        // If not, can B2 move up and B1 move right
        this.moveABUp(this.activeBlock2)
        this.moveABRight(this.activeBlock1)
      } else {
        this.swapActiveBlocks()
      }
    } else if (!b1IsAbove && blocksAreVertical) { // B1 is below B2
      if (this.isCellAvailable(row2, col2 + 1)) {
        // Can B1 move right of B2?
        this.moveActiveBlock(this.activeBlock1, row1 - 1, col1 + 1)
      } else if (this.isCellAvailable(row2, col2 - 1)) {
        // If not, can B2 move left, and B1 move up
        this.moveABLeft(this.activeBlock2)
        this.moveABUp(this.activeBlock1)
      } else {
        this.swapActiveBlocks()
      }
    } else if (!b1IsLeft && blocksAreHoriz) { // B1 is to the right of B2
      if (this.isCellAvailable(row2 - 1, col2)) {
        // Can B1 move above B2?
        this.moveActiveBlock(this.activeBlock1, row1 - 1, col1 - 1)
      } else if (this.isCellAvailable(row2 + 1, col2)) {
        // If not, can B2 move down and B1 move left
        this.moveABDown(this.activeBlock2)
        this.moveABLeft(this.activeBlock1)
      } else {
        this.swapActiveBlocks()
      }
    }
  }

  dropTheActivePiece () {
    const { row: row1, col: col1 } = this.activeBlock1
    const { row: row2, col: col2 } = this.activeBlock2

    if (row1 === row2) { // If the blocks are side-by-side
      if (this.blockCanDrop(row1, col1) && this.blockCanDrop(row2, col2)) {
        this.moveABDown(this.activeBlock1)
        this.moveABDown(this.activeBlock2)
      } else {
        this.onEndTurn()
      }
    } else if (row1 < row2) { // If block 2 is lower than block 1
      if (this.blockCanDrop(row2, col2)) {
        this.moveABDown(this.activeBlock2)
        this.moveABDown(this.activeBlock1)
      } else {
        this.onEndTurn()
      }
    } else { // If block 1 is lower than block 2
      if (this.blockCanDrop(row1, col1)) {
        this.moveABDown(this.activeBlock1)
        this.moveABDown(this.activeBlock2)
      } else {
        this.onEndTurn()
      }
    }
  }

  leftTheActivePiece () {
    const { row: row1, col: col1 } = this.activeBlock1
    const { row: row2, col: col2 } = this.activeBlock2

    if (col1 === col2) { // If the blocks are vertical
      if (this.blockCanLeft(row1, col1) && this.blockCanLeft(row2, col2)) {
        this.moveABLeft(this.activeBlock1)
        this.moveABLeft(this.activeBlock2)
      }
    } else if (col1 < col2) { // If block 1 is left of block 2
      if (this.blockCanLeft(row1, col1)) {
        this.moveABLeft(this.activeBlock1)
        this.moveABLeft(this.activeBlock2)
      }
    } else { // If block 2 is left of block 1
      if (this.blockCanLeft(row2, col2)) {
        this.moveABLeft(this.activeBlock2)
        this.moveABLeft(this.activeBlock1)
      }
    }
  }

  rightTheActivePiece () {
    const { row: row1, col: col1 } = this.activeBlock1
    const { row: row2, col: col2 } = this.activeBlock2

    if (col1 === col2) { // If the blocks are vertical
      if (this.blockCanRight(row1, col1) && this.blockCanRight(row2, col2)) {
        this.moveABRight(this.activeBlock1)
        this.moveABRight(this.activeBlock2)
      }
    } else if (col1 < col2) { // If block 2 is right of block 1
      if (this.blockCanRight(row2, col2)) {
        this.moveABRight(this.activeBlock2)
        this.moveABRight(this.activeBlock1)
      }
    } else { // If block 1 is right of block 2
      if (this.blockCanRight(row1, col1)) {
        this.moveABRight(this.activeBlock1)
        this.moveABRight(this.activeBlock2)
      }
    }
  }

  blockCanDrop (row, col) {
    return this.isCellAvailable(row + 1, col)
  }

  blockCanLeft (row, col) {
    return this.isCellAvailable(row, col - 1)
  }

  blockCanRight (row, col) {
    return this.isCellAvailable(row, col + 1)
  }

  hasActivePiece () {
    return this.activeBlock1 && this.activeBlock2
  }

  moveABUp (activeBlock) {
    this.moveActiveBlock(activeBlock, activeBlock.row - 1, activeBlock.col)
  }

  moveABDown (activeBlock) {
    this.moveActiveBlock(activeBlock, activeBlock.row + 1, activeBlock.col)
  }

  moveABLeft (activeBlock) {
    this.moveActiveBlock(activeBlock, activeBlock.row, activeBlock.col - 1)
  }

  moveABRight (activeBlock) {
    this.moveActiveBlock(activeBlock, activeBlock.row, activeBlock.col + 1)
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

  dropBlocksWithSpacesBeneath () {
    const blocksAtNewPosition = []
    let didAnythingFall = false
    for (const [rowIdx, colIdx] of this.blocksThatNeedToFall) {
      if (this.isCellAvailable(rowIdx + 1, colIdx)) {
        this.board[rowIdx + 1][colIdx] = this.board[rowIdx][colIdx]
        this.board[rowIdx][colIdx] = null
        didAnythingFall = true
        blocksAtNewPosition.push([rowIdx + 1, colIdx])
      }
    }
    this.blocksThatNeedToFall = blocksAtNewPosition
    if (!didAnythingFall) {
      this.onDoneDroppingBlocks()
    }
  }

  /*
    @param blocksThatNeedToFall an array of tuples
      ex: [[rowIdx, colIdx], [rowIdx, colIdx]...]
  */
  setBlocksThatNeedToFall (blocksThatNeedToFall = []) {
    this.blocksThatNeedToFall = sortTuplesDesc(blocksThatNeedToFall)
  }

  /*
    The board is "full" if it's not possible to spawn a new piece
  */
  canSpawnNewPiece () {
    return (
      this.board[1][this.blockStartCol] === null &&
      this.board[2][this.blockStartCol] === null
    )
  }

  /*
    Search through the board for breakers, and then discover all
    of the linked blocks of the same color. Returns an array
    of tuples [[rowIdx, colIdx], ...]
  */
  getPossibleBreaks () {
    const possibleBreaks = []

    for (let rowIdx = 2; rowIdx < this.numRows; rowIdx++) {
      for (let colIdx = 0; colIdx < this.numCols; colIdx++) {
        const cell = this.getCell(rowIdx, colIdx)
        if (cell !== null && cell.isBreaker) {
          const cellCoords = [rowIdx, colIdx]
          const blocksToBreak = this.findLinkedBlocks(cellCoords, cell.color, [cellCoords])
          if (blocksToBreak.length > 1) {
            possibleBreaks.push(blocksToBreak)
          }
        }
      }
    }

    return possibleBreaks
  }

  /*
    A new match if there is a block of the same color that has not been matched yet
  */
  isCellANewMatch ([row, col], matches, color) {
    return (
      this.isWithinBounds(row, col) &&
      this.getCell(row, col) !== null &&
      this.getCell(row, col).color === color &&
      !matches.some(([rowIdx, colIdx]) => (rowIdx === row) && (colIdx === col))
    )
  }

  /*
    Starting at a given cell, traverse the board and find all blocks
    that are attached/touching/adjacent to this cell, with the same
    color. This function is recursive. It will return an array
    of tuples [[rowIdx, colIdx], ...]
  */
  findLinkedBlocks ([currRow, currCol], color, blocksFoundSoFar) {
    const cellAbove = [currRow - 1, currCol]
    const cellRight = [currRow, currCol + 1]
    const cellBelow = [currRow + 1, currCol]
    const cellLeft = [currRow, currCol - 1]

    let matches = [...blocksFoundSoFar]

    const cellAboveMatches = this.isCellANewMatch(cellAbove, matches, color)
    if (cellAboveMatches) {
      matches.push(cellAbove)
      matches = this.findLinkedBlocks(cellAbove, color, matches)
    }

    const cellRightMatches = this.isCellANewMatch(cellRight, matches, color)
    if (cellRightMatches) {
      matches.push(cellRight)
      matches = this.findLinkedBlocks(cellRight, color, matches)
    }

    const cellBelowMatches = this.isCellANewMatch(cellBelow, matches, color)
    if (cellBelowMatches) {
      matches.push(cellBelow)
      matches = this.findLinkedBlocks(cellBelow, color, matches)
    }

    const cellLeftMatches = this.isCellANewMatch(cellLeft, matches, color)
    if (cellLeftMatches) {
      matches.push(cellLeft)
      matches = this.findLinkedBlocks(cellLeft, color, matches)
    }

    return matches
  }

  /*
    Clears cells in the board.
    @param setsOfBreaks is a 3d array. The top level contains groups
      of "breaks". Each "break" contains an array of tuples, where each
      represents a cell's coordinates.
      [
        [[rowIdx, colIdx], ...], // Break #1
      ]
  */
  breakBlocks (setsOfBreaks = []) {
    for (const [rowIdx, colIdx] of setsOfBreaks.flat()) {
      this.board[rowIdx][colIdx] = null
    }
  }
}

export default BoardManager
