import { getRandomArrayEl } from '../../utils/random'

export const BlockColors = {
  RED: 'RED',
  BLUE: 'BLUE',
  GREEN: 'GREEN',
  YELLOW: 'YELLOW'
}

export const BLOCKCOLORHEX = {
  [BlockColors.RED]: '#ff0000',
  [BlockColors.BLUE]: '#0000ff',
  [BlockColors.GREEN]: '#00ff00',
  [BlockColors.YELLOW]: '#ffff00'
}

export const possibleBlockColors = Object.values(BlockColors)

export const getRandomBlockColor = () => getRandomArrayEl(possibleBlockColors)
