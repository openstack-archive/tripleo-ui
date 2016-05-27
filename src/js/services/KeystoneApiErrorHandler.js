import BaseHttpRequestErrorHandler from '../components/utils/BaseHttpRequestErrorHandler';

export default class KeystoneApiErrorHandler extends BaseHttpRequestErrorHandler {
  _generateErrors(errorObj) {
    let errors = [];
    // A weak check to find out if it's not an xhr object.
    if(!errorObj.status && errorObj.message) {
      errors.push({
        title: 'Error',
        message: errorObj.message
      });
      return errors;
    }
    switch(errorObj.status) {
    case 0:
      errors.push({
        title: 'Connection Error',
        message: 'Connection to Keystone is not available'
      });
      break;
    case 401: {
      let error = JSON.parse(errorObj.responseText).error;
      errors.push({
        title: 'Unauthorized',
        message: error.message
      });
      break;
    }
    default:
      break;
    }
    return errors;
  }

  // TODO(jtomasek): remove this, I am leaving this here just for example reasons
  // this function should be implemented by form related subclass.
  _generateFormFieldErrors() {
    return {};
  }
}
