// const sortTuplesDesc = sort(([aKey], [bKey]) => bKey - aKey)

class BoardManager {
  constructor ({ numRows, numCols, onEndTurn, onCannotSpawn, onDoneDroppingBlocks }) {
    this.numRows = numRows
    this.numCols = numCols
    this.blockStartCol = 3
    this.startRowBlockOne = 0
    this.startRowBlockTwo = 1

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

  resetBoard (numRows, numCols) {
    return [...new Array(numRows)].map(() => [...new Array(numCols)].fill(null))
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
    console.log('Dropping blocks')
    const blocksThatCanDropAgain = []
    for (const [rowIdx, colIdx] of this.blocksThatNeedToFall) {
      if (this.isCellAvailable(rowIdx + 1, colIdx)) {
        this.board[rowIdx + 1][colIdx] = this.board[rowIdx][colIdx]
        this.board[rowIdx][colIdx] = null
        if (this.isCellAvailable(rowIdx + 2, colIdx)) {
          blocksThatCanDropAgain.push([rowIdx + 1, colIdx])
        }
      }
    }
    this.blocksThatNeedToFall = blocksThatCanDropAgain
    if (blocksThatCanDropAgain.length === 0) {
      this.onDoneDroppingBlocks()
    }
  }

  /*
    @param blocksThatNeedToFall = [[rowIdx, colIdx], [rowIdx, colIdx]...]
      expects array to be sorted with highest rowIndexes first
  */
  setBlocksThatNeedToFall (blocksThatNeedToFall) {
    // This is an array of tuples. Each tuple
    // represents [rowIdx, colIdx]. The array must be sorted
    // with highests rowIdx first
    this.blocksThatNeedToFall = blocksThatNeedToFall
  }

  // The board is "full" if it's not possible to spawn a new piece
  canSpawnNewPiece () {
    return (
      this.board[1][this.blockStartCol] === null &&
      this.board[2][this.blockStartCol] === null
    )
  }

  getPossibleBreaks () {
    const possibleBreaks = []

    for (let rowIdx = 2; rowIdx < this.numRows; rowIdx++) {
      for (let colIdx = 2; colIdx < this.numCols; colIdx++) {
        const thisCell = this.getCell(rowIdx, colIdx)
        if (thisCell !== null && thisCell.isBreaker) {
          const newBreak = {
            color: thisCell.color,
            breakerLocation: [rowIdx, colIdx],
            numberOfBlocksToBreak: 0,
            blocksInThisBreak: []
          }
          // Found a breaker. Begin recursively looking for all linked
          // normal blocks
          newBreak.blocksInThisBreak = this.findLinkedBlocks(thisCell.color, rowIdx, colIdx, [rowIdx, colIdx])
          newBreak.numberOfBlocksToBreak = newBreak.blocksInThisBreak.length
          console.log(newBreak)
          if (newBreak.numberOfBlocksToBreak > 0) {
            possibleBreaks.push(newBreak)
          }
        }
      }
    }

    console.log('possible breaks', possibleBreaks)
  }

  // Recursive
  findLinkedBlocks (color, currRow, currCol, blocksFoundSoFar) {
    const rowAbove = currRow - 1
    const rowBelow = currRow + 1
    const colLeft = currCol - 1
    const colRight = currCol + 1

    let matches = [...blocksFoundSoFar]

    const cellAboveMatches = (
      this.isWithinBounds(rowAbove, currCol) &&
      this.getCell(rowAbove, currCol) !== null &&
      this.getCell(rowAbove, currCol).color === color &&
      !matches.some(([rowIdx, colIdx]) => (rowIdx === rowAbove) && (colIdx === currCol))
    )

    const cellBelowMatches = (
      this.isWithinBounds(rowBelow, currCol) &&
      this.getCell(rowBelow, currCol) !== null &&
      this.getCell(rowBelow, currCol).color === color &&
      !matches.some(([rowIdx, colIdx]) => (rowIdx === rowBelow) && (colIdx === currCol))
    )

    const cellRightMatches = (
      this.isWithinBounds(currRow, colRight) &&
      this.getCell(currRow, colRight) !== null &&
      this.getCell(currRow, colRight).color === color &&
      !matches.some(([rowIdx, colIdx]) => (rowIdx === currRow) && (colIdx === colRight))
    )

    const cellLeftMatches = (
      this.isWithinBounds(currRow, colLeft) &&
      this.getCell(currRow, colLeft) !== null &&
      this.getCell(currRow, colLeft).color === color &&
      !matches.some(([rowIdx, colIdx]) => (rowIdx === currRow) && (colIdx === colLeft))
    )

    if (cellAboveMatches) {
      matches.push([rowAbove, currCol])
      matches = this.findLinkedBlocks(color, rowAbove, currCol, matches)
    }

    if (cellRightMatches) {
      matches.push([currRow, colRight])
      matches = this.findLinkedBlocks(color, currRow, colRight, matches)
    }

    if (cellBelowMatches) {
      matches.push([rowBelow, currCol])
      matches = this.findLinkedBlocks(color, rowBelow, currCol, matches)
    }

    if (cellLeftMatches) {
      matches.push([currRow, colLeft])
      matches = this.findLinkedBlocks(color, currRow, colLeft, matches)
    }

    return matches
  }
}

export default BoardManager
