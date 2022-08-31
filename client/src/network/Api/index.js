import { GameAPI } from './GameAPI'
import Logger from '../../utils/Logger'

Logger.debug('Api/index.js::Instantiating a new GameApi object.')

export const API = new GameAPI()
