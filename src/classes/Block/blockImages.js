import { BlockColors } from './blockColors'
import { BlockTypes } from './blockTypes'
import { ImageKeys } from '../TetrisGame/images'

// Maps a BlockType + BlockColor to a corresponding Image (key)
export const BlockImages = {
  [BlockTypes.CEMENT]: {
    [BlockColors.RED]: ImageKeys.CementBlock,
    [BlockColors.BLUE]: ImageKeys.CementBlock,
    [BlockColors.GREEN]: ImageKeys.CementBlock,
    [BlockColors.YELLOW]: ImageKeys.CementBlock
  },
  [BlockTypes.TRANSPARENT]: {
    [BlockColors.RED]: ImageKeys.RedGreyBlock,
    [BlockColors.BLUE]: ImageKeys.BlueGreyBlock,
    [BlockColors.GREEN]: ImageKeys.GreenGreyBlock,
    [BlockColors.YELLOW]: ImageKeys.YellowGreyBlock
  },
  [BlockTypes.NORMAL]: {
    [BlockColors.RED]: ImageKeys.RedBlock,
    [BlockColors.BLUE]: ImageKeys.BlueBlock,
    [BlockColors.GREEN]: ImageKeys.GreenBlock,
    [BlockColors.YELLOW]: ImageKeys.YellowBlock
  },
  [BlockTypes.BREAKER]: {
    [BlockColors.RED]: ImageKeys.RedBreaker,
    [BlockColors.BLUE]: ImageKeys.BlueBreaker,
    [BlockColors.GREEN]: ImageKeys.GreenBreaker,
    [BlockColors.YELLOW]: ImageKeys.YellowBreaker
  }
}