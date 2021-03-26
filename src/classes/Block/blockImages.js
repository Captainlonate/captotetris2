import { BlockColors } from './blockColors'
import { BlockTypes } from './blockTypes'
import { ImageKeys } from '../TetrisGame/images'

export const AnimationState = {
  IDLE: 'IDLE',
  RARE: 'RARE'
}

// Maps a BlockType + BlockColor + Animation State to a corresponding Image (key)
export const BlockImages = {
  [BlockTypes.CEMENT]: {
    [BlockColors.RED]: { [AnimationState.IDLE]: ImageKeys.CementBlock, [AnimationState.RARE]: ImageKeys.CementBlock },
    [BlockColors.BLUE]: { [AnimationState.IDLE]: ImageKeys.CementBlock, [AnimationState.RARE]: ImageKeys.CementBlock },
    [BlockColors.GREEN]: { [AnimationState.IDLE]: ImageKeys.CementBlock, [AnimationState.RARE]: ImageKeys.CementBlock },
    [BlockColors.YELLOW]: { [AnimationState.IDLE]: ImageKeys.CementBlock, [AnimationState.RARE]: ImageKeys.CementBlock }
  },
  [BlockTypes.TRANSPARENT]: {
    [BlockColors.RED]: { [AnimationState.IDLE]: ImageKeys.RedGreyBlock, [AnimationState.RARE]: ImageKeys.RedGreyBlock },
    [BlockColors.BLUE]: { [AnimationState.IDLE]: ImageKeys.BlueGreyBlock, [AnimationState.RARE]: ImageKeys.BlueGreyBlock },
    [BlockColors.GREEN]: { [AnimationState.IDLE]: ImageKeys.GreenGreyBlock, [AnimationState.RARE]: ImageKeys.GreenGreyBlock },
    [BlockColors.YELLOW]: { [AnimationState.IDLE]: ImageKeys.YellowGreyBlock, [AnimationState.RARE]: ImageKeys.YellowGreyBlock }
  },
  [BlockTypes.NORMAL]: {
    [BlockColors.RED]: { [AnimationState.IDLE]: ImageKeys.RedBlock, [AnimationState.RARE]: ImageKeys.RedBlock },
    [BlockColors.BLUE]: { [AnimationState.IDLE]: ImageKeys.BlueBlock, [AnimationState.RARE]: ImageKeys.BlueBlock },
    [BlockColors.GREEN]: { [AnimationState.IDLE]: ImageKeys.GreenBlock, [AnimationState.RARE]: ImageKeys.GreenBlock },
    [BlockColors.YELLOW]: { [AnimationState.IDLE]: ImageKeys.YellowBlock, [AnimationState.RARE]: ImageKeys.YellowBlock }
  },
  [BlockTypes.BREAKER]: {
    [BlockColors.RED]: { [AnimationState.IDLE]: ImageKeys.RedBreaker, [AnimationState.RARE]: ImageKeys.RedBreakerRare },
    [BlockColors.BLUE]: { [AnimationState.IDLE]: ImageKeys.BlueBreaker, [AnimationState.RARE]: ImageKeys.BlueBreaker },
    [BlockColors.GREEN]: { [AnimationState.IDLE]: ImageKeys.GreenBreaker, [AnimationState.RARE]: ImageKeys.GreenBreaker },
    [BlockColors.YELLOW]: { [AnimationState.IDLE]: ImageKeys.YellowBreaker, [AnimationState.RARE]: ImageKeys.YellowBreaker }
  }
}

export const BlockColorToShatterImage = {
  [BlockColors.RED]: ImageKeys.RedBlockShatter,
  [BlockColors.BLUE]: ImageKeys.BlueBlockShatter,
  [BlockColors.GREEN]: ImageKeys.GreenBlockShatter,
  [BlockColors.YELLOW]: ImageKeys.YellowBlockShatter
}
