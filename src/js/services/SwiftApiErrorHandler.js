import BaseHttpRequestErrorHandler from '../components/utils/BaseHttpRequestErrorHandler';

export default class SwiftApiErrorHandler extends BaseHttpRequestErrorHandler {
  _generateErrors(errorObj) {
    let errors = [];
    let error;
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
        message: 'Connection to Swift is not available'
      });
      break;
    case 401:
      error = JSON.parse(errorObj.responseText).error;
      errors.push({
        title: 'Unauthorized',
        message: error.message
      });
      break;
    case 404:
      error = JSON.parse(errorObj.responseText).error;
      errors.push({
        title: 'Not found',
        message: error.message
      });
      break;
    default:
      error = JSON.parse(errorObj.responseText).error;
      errors.push({
        title: 'Swift API',
        message: error.message
      });
      break;
    }
    return errors;
  }
}
