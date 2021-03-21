import greenBreakerIdleImage from '../../images/breakers/green_breaker_animation_idle.png'
import blueBreakerIdleImage from '../../images/breakers/blue_breaker_3d_512.png'
import yellowBreakerIdleImage from '../../images/breakers/yellow_breaker_3d_512.png'
import redBreakerIdleImage from '../../images/breakers/red_breaker_animation_idle.png'

import redBreakerRareImage from '../../images/breakers/red_breaker_animation_rare.png'

import blueBlockImage from '../../images/blocks/blue_block_3d_512.png'
import redBlockImage from '../../images/blocks/red_block_3d_512.png'
import greenBlockImage from '../../images/blocks/green_block_3d_512.png'
import yellowBlockImage from '../../images/blocks/yellow_block_3d_512.png'

import blueGreyBlockImage from '../../images/blocks/blueGreyPiece.png'
import redGreyBlockImage from '../../images/blocks/redGreyPiece.png'
import greenGreyBlockImage from '../../images/blocks/greenGreyPiece.png'
import yellowGreyBlockImage from '../../images/blocks/yellowGreyPiece.png'
import cementBlockImage from '../../images/blocks/cementPiece.png'

export const ImageKeys = {
  BlueBlock: 'BlueBlock',
  RedBlock: 'RedBlock',
  GreenBlock: 'GreenBlock',
  YellowBlock: 'YellowBlock',
  // AnimationState.IDLE
  YellowBreaker: 'YellowBreaker',
  BlueBreaker: 'BlueBreaker',
  GreenBreaker: 'GreenBreaker',
  RedBreaker: 'RedBreaker',
  // AnimationState.RARE
  RedBreakerRare: 'RedBreakerRare',

  BlueGreyBlock: 'BlueGreyBlock',
  RedGreyBlock: 'RedGreyBlock',
  GreenGreyBlock: 'GreenGreyBlock',
  YellowGreyBlock: 'YellowGreyBlock',
  CementBlock: 'CementBlock'
}

export const ImageLabelsToPaths = {
  [ImageKeys.BlueBlock]: blueBlockImage,
  [ImageKeys.RedBlock]: redBlockImage,
  [ImageKeys.GreenBlock]: greenBlockImage,
  [ImageKeys.YellowBlock]: yellowBlockImage,
  // AnimationState.IDLE
  [ImageKeys.YellowBreaker]: yellowBreakerIdleImage,
  [ImageKeys.BlueBreaker]: blueBreakerIdleImage,
  [ImageKeys.GreenBreaker]: greenBreakerIdleImage,
  // [ImageKeys.RedBreaker]: 'images/breakers/red_breaker_animation_idle.png',
  [ImageKeys.RedBreaker]: redBreakerIdleImage,
  // AnimationState.RARE
  [ImageKeys.RedBreakerRare]: redBreakerRareImage,

  [ImageKeys.BlueGreyBlock]: blueGreyBlockImage,
  [ImageKeys.RedGreyBlock]: redGreyBlockImage,
  [ImageKeys.GreenGreyBlock]: greenGreyBlockImage,
  [ImageKeys.YellowGreyBlock]: yellowGreyBlockImage,
  [ImageKeys.CementBlock]: cementBlockImage
}

export const BlockAnimationMeta = {
  [ImageKeys.BlueBlock]: { numberOfFrames: 1, framesPerColumn: 1, numberOfRows: 1 },
  [ImageKeys.RedBlock]: { numberOfFrames: 1, framesPerColumn: 1, numberOfRows: 1 },
  [ImageKeys.GreenBlock]: { numberOfFrames: 1, framesPerColumn: 1, numberOfRows: 1 },
  [ImageKeys.YellowBlock]: { numberOfFrames: 1, framesPerColumn: 1, numberOfRows: 1 },
  // AnimationState.IDLE
  [ImageKeys.GreenBreaker]: { numberOfFrames: 30, framesPerColumn: 8, numberOfRows: 4 },
  [ImageKeys.YellowBreaker]: { numberOfFrames: 1, framesPerColumn: 1, numberOfRows: 1 },
  [ImageKeys.RedBreaker]: { numberOfFrames: 30, framesPerColumn: 8, numberOfRows: 4 },
  [ImageKeys.BlueBreaker]: { numberOfFrames: 1, framesPerColumn: 1, numberOfRows: 1 },
  // AnimationState.RARE
  [ImageKeys.RedBreakerRare]: { numberOfFrames: 30, framesPerColumn: 8, numberOfRows: 4 },

  [ImageKeys.BlueGreyBlock]: { numberOfFrames: 1, framesPerColumn: 1, numberOfRows: 1 },
  [ImageKeys.RedGreyBlock]: { numberOfFrames: 1, framesPerColumn: 1, numberOfRows: 1 },
  [ImageKeys.GreenGreyBlock]: { numberOfFrames: 1, framesPerColumn: 1, numberOfRows: 1 },
  [ImageKeys.YellowGreyBlock]: { numberOfFrames: 1, framesPerColumn: 1 },
  [ImageKeys.CementBlock]: { numberOfFrames: 1, framesPerColumn: 1 }
}

// Within each sprite sheet, each animation frame will be
// this width and height:
export const BlockImageSize = 512
