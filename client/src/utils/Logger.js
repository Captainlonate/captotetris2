/**
 * There are different types of logs (debug, error, etc.)
 * Whether or not they display in the console is based on
 * some flags set on window.captotetris.logs.
 *
 * This is helpful so that, via the console, even in production,
 * I can dynamically enable or disable them.
 *
 * Example:
 *  window.captotetris.logs.debug = true
 *  ...Then perform the UI action and see the logs print...
 */
window.captotetris = window.captotetris ?? {}
window.captotetris.logs = window.captotetris.logs ?? {
  debug: true,
  network: true,
  state: false,
  error: true,
}

export class Logger {
  debug(...msg) {
    if (window.captotetris.logs.debug) {
      console.log('%c(ℹ)%c', 'color: white; background: #3ec2ff;', '', ...msg)
    }
  }

  network(...msg) {
    if (window.captotetris.logs.network) {
      console.log('%c(N)%c', 'color: white; background: #3bbd53;', '', ...msg)
    }
  }

  state(...msg) {
    if (window.captotetris.logs.state) {
      console.log('%c(S)%c', 'color: white; background: #b96f1c;', '', ...msg)
    }
  }

  error(...msg) {
    if (window.captotetris.logs.error) {
      console.log('%c(X)%c', 'color: yellow; background: #e04800;', '', ...msg)
    }
  }

  logEnvironment() {
    this.debug('Environment: ' + process.env.NODE_ENV)
  }

  logTime(...msg) {
    const d = new Date()
    const time = d.toLocaleString
      ? d.toLocaleString('en-US')
      : `${d.getHours()}:${d.getSeconds()}:${d.getMilliseconds()}`

    this.debug(time, ...msg)
  }
}

const logger = new Logger()

export default logger
