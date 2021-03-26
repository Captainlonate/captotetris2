class BorderManager {
  constructor ({ numRows, numCols } = {}) {
    this.numRows = numRows
    this.numCols = numCols
    this._cellsToBeBordered = []
    this._allCellCoordinates = []
  }

  get doesAnythingNeedBordered () {
    return this._cellsToBeBordered.length > 0
  }

  get cellsToBeBordered () {
    return this._cellsToBeBordered
  }

  getCoords (row, col, side) {
    return this._allCellCoordinates[row][col][side]
  }

  clearCellsToBeBordered () {
    this._cellsToBeBordered = []
  }

  setCellsToBeBordered (setsOfBreaks) {
    const borderedCells = []

    for (const coloredSet of setsOfBreaks) {
      for (const [row, col] of coloredSet.cells) {
        const borderTop = !coloredSet.cells.some(([r, c]) => r === row - 1 && c === col)
        const borderRight = !coloredSet.cells.some(([r, c]) => r === row && c === col + 1)
        const borderBottom = !coloredSet.cells.some(([r, c]) => r === row + 1 && c === col)
        const borderLeft = !coloredSet.cells.some(([r, c]) => r === row && c === col - 1)

        const cell = {
          color: coloredSet.color,
          row,
          col,
          sides: [
            ...(borderTop ? ['top'] : []),
            ...(borderRight ? ['right'] : []),
            ...(borderBottom ? ['bottom'] : []),
            ...(borderLeft ? ['left'] : [])
          ]
        }

        if (cell.sides.length) {
          borderedCells.push(cell)
        }
      }
    }

    this._cellsToBeBordered = borderedCells
  }

  recalculateAllCellCoordinates ({ blockSize, xOffset }) {
    this._allCellCoordinates = [...new Array(this.numRows)].map(() => [...new Array(this.numCols)].fill(null))

    for (let row = 0; row < this.numRows; row++) {
      for (let col = 0; col < this.numCols; col++) {
        this._allCellCoordinates[row][col] = this.calculateOneCellCoordinates(row, col, blockSize, xOffset)
      }
    }
  }

  // For a given cell's (row, col), compute the coordinates
  // necessary to stroke() each of the 4 borders
  // Each of the 4 sides returns [startX, startY, endX, endY]
  calculateOneCellCoordinates (row, col, blockSize, xOffset) {
    const topLeftX = (col * blockSize) + xOffset
    const topLeftY = row * blockSize
    const bottomRightX = ((col * blockSize) + blockSize) + xOffset
    const bottomRightY = (row * blockSize) + blockSize
    return {
      top: [topLeftX - 1, topLeftY, topLeftX + blockSize + 1, topLeftY],
      right: [bottomRightX, bottomRightY + 1, bottomRightX, bottomRightY - blockSize - 1],
      bottom: [bottomRightX + 1, bottomRightY, bottomRightX - blockSize - 1, bottomRightY],
      left: [topLeftX, topLeftY - 1, topLeftX, topLeftY + blockSize + 1]
    }
  }
}

export default BorderManager
