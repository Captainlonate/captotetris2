export const ImageKeys = {
  BlueBlock: 'BlueBlock',
  RedBlock: 'RedBlock',
  GreenBlock: 'GreenBlock',
  YellowBlock: 'YellowBlock',
  YellowBreaker: 'YellowBreaker',
  BlueBreaker: 'BlueBreaker',
  GreenBreaker: 'GreenBreaker',
  RedBreaker: 'RedBreaker',
  BlueGreyBlock: 'BlueGreyBlock',
  RedGreyBlock: 'RedGreyBlock',
  GreenGreyBlock: 'GreenGreyBlock',
  YellowGreyBlock: 'YellowGreyBlock',
  CementBlock: 'CementBlock'
}

export const ImageLabelsToPaths = {
  [ImageKeys.BlueBlock]: 'images/blocks/blue_block_3d_512.png',
  [ImageKeys.RedBlock]: 'images/blocks/red_block_3d_512.png',
  [ImageKeys.GreenBlock]: 'images/blocks/green_block_3d_512.png',
  [ImageKeys.YellowBlock]: 'images/blocks/yellow_block_3d_512.png',

  [ImageKeys.YellowBreaker]: 'images/breakers/yellow_breaker_3d_512.png',
  [ImageKeys.BlueBreaker]: 'images/breakers/blue_breaker_3d_512.png',
  [ImageKeys.GreenBreaker]: 'images/breakers/green_breaker_animation.png',
  [ImageKeys.RedBreaker]: 'images/breakers/red_breaker_animation_idle.png',

  [ImageKeys.BlueGreyBlock]: 'images/blueGreyPiece.png',
  [ImageKeys.RedGreyBlock]: 'images/redGreyPiece.png',
  [ImageKeys.GreenGreyBlock]: 'images/greenGreyPiece.png',
  [ImageKeys.YellowGreyBlock]: 'images/yellowGreyPiece.png',
  [ImageKeys.CementBlock]: 'images/cementPiece.png'
}

export const BlockAnimationMeta = {
  [ImageKeys.BlueBlock]: {
    numberOfFrames: 1,
    framesPerColumn: 1,
    numberOfRows: 1
  },
  [ImageKeys.RedBlock]: {
    numberOfFrames: 1,
    framesPerColumn: 1,
    numberOfRows: 1
  },
  [ImageKeys.GreenBlock]: {
    numberOfFrames: 1,
    framesPerColumn: 1,
    numberOfRows: 1
  },
  [ImageKeys.YellowBlock]: {
    numberOfFrames: 1,
    framesPerColumn: 1,
    numberOfRows: 1
  },
  [ImageKeys.GreenBreaker]: {
    numberOfFrames: 24,
    framesPerColumn: 4,
    numberOfRows: 6
  },
  [ImageKeys.YellowBreaker]: {
    numberOfFrames: 1,
    framesPerColumn: 1,
    numberOfRows: 1
  },
  [ImageKeys.RedBreaker]: {
    numberOfFrames: 24,
    framesPerColumn: 4,
    numberOfRows: 6
  },
  [ImageKeys.BlueBreaker]: {
    numberOfFrames: 1,
    framesPerColumn: 1,
    numberOfRows: 1
  },
  [ImageKeys.BlueGreyBlock]: {
    numberOfFrames: 1,
    framesPerColumn: 1,
    numberOfRows: 1
  },
  [ImageKeys.RedGreyBlock]: {
    numberOfFrames: 1,
    framesPerColumn: 1,
    numberOfRows: 1
  },
  [ImageKeys.GreenGreyBlock]: {
    numberOfFrames: 1,
    framesPerColumn: 1,
    numberOfRows: 1
  },
  [ImageKeys.YellowGreyBlock]: {
    numberOfFrames: 1,
    framesPerColumn: 1
  },
  [ImageKeys.CementBlock]: {
    numberOfFrames: 1,
    framesPerColumn: 1
  }
}

export const BlockImageSize = 512
