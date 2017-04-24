import { ZAQAR_LOGGING_QUEUE } from '../../../constants/ZaqarConstants';
import ZaqarActions from '../../../actions/ZaqarActions';
import Adapter from './BaseAdapter';

export default class ZaqarAdapter extends Adapter {
  constructor(dispatch) {
    super(dispatch);
    this.indent = 0;
    this.buffer = [];
  }

  _formatMessage(message, level) {
    return {
      message,
      level,
      timestamp: Date.now()
    };
  }

  _send(message, level) {
    if (this.indent !== 0) {
      this.buffer.push({
        message,
        level
      });
      return;
    }

    message = message[0];

    // NOTE(hpokorny): Ignore messages that contain Redux state for performance
    // reasons: JSON.stringify is too slow
    if (message.length && message.length === 2) {
      if (message[0] === 'prev state' || message[0] === 'next state') {
        return;
      }
    }

    const msg = this._formatMessage(message, level);
    this._dispatch(ZaqarActions.postMessage(ZAQAR_LOGGING_QUEUE, msg));
  }

  debug(...args) {
    this._send(args, 'debug');
  }

  info(...args) {
    this._send(args, 'info');
  }

  warn(...args) {
    this._send(args, 'warn');
  }

  error(...args) {
    this._send(args, 'error');
  }

  group(...args) {
    this.indent++;
  }

  groupCollapsed(...args) {
    this.indent++;
  }

  groupEnd(...args) {
    this.indent--;

    this.buffer.map(m => {
      this._send(m.message, m.level);
    });

    this.buffer = [];
  }

  log(...args) {
    this.info(args);
  }
}
