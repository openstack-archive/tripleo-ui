export default class Adapter {
  constructor(dispatch) {
    this._dispatch = dispatch;
  }

  debug(...args) {}

  info(...args) {}

  warn(...args) {}

  error(...args) {}

  group(...args) {}

  groupCollapsed(...args) {}

  groupEnd(...args) {}

  log(...args) {}
}
