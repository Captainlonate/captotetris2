// class BoardTraverser {
//   constructor (board) {
//     this.board = board
//     this.numRows = board.length
//     this.numCols = board[0].length
//   }
// }

// export default BoardTraverser

/*
  const foundSoFar = [
    [rowIdx, colIdx]
  ]
  !foundSoFar.some(([rowIdx, colIdx]) => rowIdx === 0 && colIdx === 0)
*/

const traverse = (board, numRows, numCols, color, currRow, currCol, blocksFoundSoFar) => {
  // const cellAbove = {
  //   isBreakable: 
  // }
  const rowAbove = currRow - 1
  const rowBelow = currRow + 1
  const colLeft = currCol - 1
  const colRight = currCol + 1

  // const canCheckAbove
  
  // Check Above

}

export const findLinkedBlocks = (board, color, currRow, currCol) => {
  return traverse(board, board.length, board[0].length, color, currRow, currCol, [])
}
