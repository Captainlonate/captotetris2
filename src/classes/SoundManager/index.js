class SoundManager {
  /*
    soundsConfig should be an object like:
      {
        'soundName': {
          'path': 'path/to/file.wav',
          'volume': 0.1
        }
      }
  */
  constructor (soundsConfig = {}) {
    this.sounds = this.init(soundsConfig)
    this.currentlyPlayingSound = null
  }

  init (config = {}) {
    const sounds = {}
    for (const key in config) {
      const audio = new window.Audio(config[key].path)
      audio.volume = config[key].volume || 0.1
      sounds[key] = audio
    }
    return sounds
  }

  play (key) {
    if (this.sounds[key] && this.currentlyPlayingSound === null) {
      this.sounds[key].play()
    }
  }
}

export default SoundManager
