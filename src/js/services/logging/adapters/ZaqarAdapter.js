import { ZAQAR_DEFAULT_QUEUE } from '../../../constants/ZaqarConstants';
import ZaqarWebSocketService from '../../../services/ZaqarWebSocketService';
import Adapter from './BaseAdapter';

export default class ZaqarAdapter extends Adapter {
  constructor() {
    super();
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

    const msg = this._formatMessage(message, level);
    ZaqarWebSocketService.postMessage(ZAQAR_DEFAULT_QUEUE, msg);
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
