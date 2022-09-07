import { getRandomArrayEl } from '../../utils/random'

export const BlockColors = {
  RED: 'RED',
  BLUE: 'BLUE',
  GREEN: 'GREEN',
  YELLOW: 'YELLOW',
}

export const BLOCKCOLORHEX = {
  [BlockColors.RED]: '#ff0000',
  [BlockColors.BLUE]: '#2ba2ff',
  [BlockColors.GREEN]: '#00ff00',
  [BlockColors.YELLOW]: '#ffff00',
  [BlockColors.TRASH]: '#808080',
}

export const ShadowBlockColors = {
  codeToColor: {
    1: '#8f1a1a', // RED BLOCK
    2: '#0a489f', // BLUE BLOCK
    3: '#0f610e', // GREEN BLOCK
    4: '#bfbb11', // YELLOW BLOCK
    A: '#f72828', // RED BREAKER
    B: '#2d28bf', // BLUE BREAKER
    C: '#00e51c', // GREEN BREAKER
    D: '#fffc83', // YELLOW BREAKER
    T: '#808080', // TRASH BLOCK
  },
  colorToCode: {
    breaker: {
      [BlockColors.RED]: 'A',
      [BlockColors.BLUE]: 'B',
      [BlockColors.GREEN]: 'C',
      [BlockColors.YELLOW]: 'D',
    },
    block: {
      [BlockColors.RED]: '1',
      [BlockColors.BLUE]: '2',
      [BlockColors.GREEN]: '3',
      [BlockColors.YELLOW]: '4',
      [BlockColors.TRASH]: 'T',
    },
  },
}

window.ShadowBlockColors = ShadowBlockColors

export const possibleBlockColors = Object.values(BlockColors)

export const getRandomBlockColor = () => getRandomArrayEl(possibleBlockColors)
