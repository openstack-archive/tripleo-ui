import Adapter from './BaseAdapter';

export default class ConsoleAdapter extends Adapter {
  debug(...args) {
    console.debug(...args); // eslint-disable-line no-console
  }

  info(...args) {
    console.info(...args); // eslint-disable-line no-console
  }

  warn(...args) {
    console.warn(...args); // eslint-disable-line no-console
  }

  error(...args) {
    console.error(...args); // eslint-disable-line no-console
  }

  group(...args) {
    console.group(...args); // eslint-disable-line no-console
  }

  groupCollapsed(...args) {
    console.groupCollapsed(...args); // eslint-disable-line no-console
  }

  groupEnd(...args) {
    console.groupEnd(...args); // eslint-disable-line no-console
  }

  log(...args) {
    console.log(...args); // eslint-disable-line no-console
  }
}
