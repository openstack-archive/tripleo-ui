import BaseHttpRequestErrorHandler from '../components/utils/BaseHttpRequestErrorHandler';

export default class ValidationsApiErrorHandler extends BaseHttpRequestErrorHandler {
  _generateErrors(errorObj) {
    let errors = [];
    if(!errorObj.constructor === XMLHttpRequest) {
      errors.push({
        title: 'Error',
        message: error
      });
      return errors;
    }
    switch(errorObj.status) {
    case 0:
      errors.push({
        title: 'Connection Error',
        message: 'Connection to Validations API is not available'
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
}
