import when from 'when';

import TempStorageWorker from '../workers/TempStorageWorker';

// const WORKER_URL = '/js/tripleo_ui_tempstorage_worker.js';

class TempStorage {

  constructor() {
    this._createWorkerInstance();
    // This promise is resolved when the store has been loaded from
    // the worker for the first time.
    this._def = when.defer();
    this.initialized = this._def.promise;
    this._initStore();
  }

  _createWorkerInstance() {
    if(window && window.SharedWorker) {
      // this.worker = new window.SharedWorker(WORKER_URL);
      this.worker = new TempStorageWorker();
      this.worker.port.start();
    }
  }

  _initStore() {
    if(this.worker) {

      this.worker.port.onmessage = e => {
        if(e.data !== null && typeof e.data === 'object') {
          for(let key in e.data) {
            let val = e.data[key];
            if(val === undefined) {
              sessionStorage.removeItem(key);
            }
            else {
              // sessionStorage can only store text, so serialize if necessary.
              val = (typeof(val) === 'object') ? JSON.stringify(val) : val;
              sessionStorage.setItem(key, val);
            }
          }
          this._def.resolve(e.data);
        }
      };
      this.worker.port.postMessage(true);
    }
  }

  /**
   * Get an item from the store.
   */
  getItem(key) {
    let item = sessionStorage.getItem(key);
    // Try to deserialize, if the original value was an object/array.
    try {
      return JSON.parse(item);
    } catch(err) {
      return item;
    }
  }

  /**
   * Add/modifiy an item in the store
   */
  setItem(key, val) {
    let storeObj = {};
    // sessionStorage can only store text, so serialize if necessary.
    val = (typeof(val) === 'object') ? JSON.stringify(val) : val;
    storeObj[key] = val;
    this.worker.port.postMessage(storeObj);
  }

  /**
   * Remove an item from the store
   */
  removeItem(key) {
    let storeObj = {};
    storeObj[key] = undefined;
    this.worker.port.postMessage(storeObj);
  }

}

export default new TempStorage();
