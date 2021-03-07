import { getRandomArrayEl } from '../../utils/random'

export const BLOCKCOLORS = {
  RED: 'red',
  BLUE: 'blue',
  GREEN: 'green',
  YELLOW: 'yellow'
}

export const possibleBlockColors = Object.values(BLOCKCOLORS)

export const getRandomBlockColor = () => getRandomArrayEl(possibleBlockColors)
