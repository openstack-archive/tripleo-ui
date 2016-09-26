// Logger is a `console` replacement which is capable of sending its output to
// multiple places, like the browser console, REST APIs, or a Zaqar queue.
//
// Adding new log destinations consists of creating an adapter.  An adapter in
// this context is a subclass of Adapter.
//
// The Logger class reads the tripleOUiConfig object to determine which logger
// adapters should be activated.  By default, only the console adapter is used.
//
// Usage:
//
//   import logger from 'src/js/logger/logger';
//   logger.log('Hello world!');

class Adapter {

  debug(...args) {
  }

  info(...args) {
  }

  warn(...args) {
  }

  error(...args) {
  }

  group(...args) {
  }

  groupCollapsed(...args) {
  }

  groupEnd(...args) {
  }

  log(...args) {
  }

}

class ConsoleAdapter extends Adapter {

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

class ZaqarAdapter extends Adapter {
}

const AVAILABLE_ADAPTERS = {
  console: new ConsoleAdapter(),
  zaqar: new ZaqarAdapter()
};

class Logger {

  AVAILABLE_FUNCTIONS = [
    'debug',
    'info',
    'warn',
    'error',
    'group',
    'groupCollapsed',
    'groupEnd',
    'log'
  ]

  constructor() {
    this.adapters = [];

    if (window.tripleOUiConfig !== undefined) {
      this.loadAdapters();
    }

    this.AVAILABLE_FUNCTIONS.forEach((fn) => {
      this[fn] = function(...args) {
        return this.dispatch(fn, ...args);
      };
    });

  }

  loadAdapters() {
    if (this.adapters.length) {
      return;
    }

    if (window.tripleOUiConfig === undefined) {
      return;
    }

    let enabledAdapters = window.tripleOUiConfig.loggers || ['console'];

    enabledAdapters.forEach((adapter) => {
      let instance = AVAILABLE_ADAPTERS[adapter];

      if (instance === undefined) {
        throw Error(`Adapter ${adapter} not defined`);
      }

      this.adapters.push(instance);

    });

  }

  dispatch(fn, ...args) {
    this.loadAdapters();

    this.adapters.forEach((adapter) => {
      let f = adapter[fn];

      if (f === undefined ) {
        throw Error(`Function ${fn} not defined in ${adapter}`);
      }

      return adapter[fn](...args);
    });
  }

}

export default new Logger();
